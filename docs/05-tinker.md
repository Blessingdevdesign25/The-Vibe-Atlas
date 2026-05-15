# 🔬 Tinker Report: Five Rapid Clicks — Prediction vs Reality

## Setup

This document walks through a live experiment. The observer opens the browser's **Network tab**, clears it, and clicks a mood button **five times as fast as physically possible**. The goal is to predict exactly what the fetch logic will do, then compare against what actually fires on the wire.

---

## Prediction (Before Running)

### Code Path Analysis

The relevant code is `useVibeImages.ts`. Here is the execution flow per click:

```typescript
const fetchImages = useCallback(async (mood: Mood) => {
    if (loading && currentMoodRef.current === mood) return;  // A: dedup
    const requestId = Date.now();                              // B: assign ID
    requestIdRef.current = requestId;
    setLoading(true);
    setError(null);
    currentMoodRef.current = mood;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // C: delay
      if (requestIdRef.current !== requestId) return;            // D: stale guard
      // ... build newImages array ...
      await Promise.all(newImages.map(/* preload 5 images */));  // E: network
      if (requestIdRef.current === requestId) setImages(newImages); // F: commit
    } catch (err) { /* ... */ }
    finally {
      if (requestIdRef.current === requestId) setLoading(false); // G: cleanup
    }
  }, [loading]);
```

### Assumptions About Human Speed

| Assumption | Value |
|------------|-------|
| Time between clicks (aggressive) | ~150–250 ms |
| Total span for 5 clicks | ~600–1000 ms |
| Artificial delay (`setTimeout`) | 1500 ms |
| Image preload time (LoremFlickr) | ~200–800 ms (variable) |

### Predicted Timeline

```
Time (ms)     Event
────────────────────────────────────────────────────────
   0          Click 1 ("calm")
              ├─ Guard A: loading=false → pass
              ├─ Guard B: requestIdRef = T1
              ├─ setLoading(true), currentMoodRef = "calm"
              └─ Timer starts (1500ms)

 200          Click 2 ("loud")
              ├─ Guard A: loading=true, mood differs → pass
              ├─ requestIdRef = T2 (overwrites T1)
              ├─ currentMoodRef = "loud"
              └─ Timer starts (1500ms)

 400          Click 3 ("warm")
              ├─ Guard A: loading=true, mood differs → pass
              ├─ requestIdRef = T3
              ├─ currentMoodRef = "warm"
              └─ Timer starts (1500ms)

 600          Click 4 ("lonely")
              ├─ Guard A: loading=true, mood differs → pass
              ├─ requestIdRef = T4
              ├─ currentMoodRef = "lonely"
              └─ Timer starts (1500ms)

 800          Click 5 ("bright")
              ├─ Guard A: loading=true, mood differs → pass
              ├─ requestIdRef = T5 (final ID)
              ├─ currentMoodRef = "bright"
              └─ Timer starts (1500ms)

1500          T1 timer resolves
              ├─ Guard D: requestIdRef (T5) !== T1 → **RETURN** 🚫
              ├─ finally: requestIdRef (T5) !== T1 → skip setLoading(false)
              └─ No network request

1700          T2 timer resolves → **RETURN** (same pattern) 🚫

1900          T3 timer resolves → **RETURN** 🚫

2100          T4 timer resolves → **RETURN** 🚫

2300          T5 timer resolves
              ├─ Guard D: requestIdRef (T5) === T5 → **PASS** ✅
              ├─ Preload 5 images via `new Image()` (NETWORK 🔥)
              │   └─ 5 requests appear in Network tab
              ├─ Guard F: requestIdRef (T5) === T5 → setImages()
              └─ finally G: requestIdRef (T5) === T5 → setLoading(false)

~2500-3100   Images rendered in DOM
              └─ Browser loads same URLs again via `<img src=...>`
                  (served from HTTP cache → 0ms, "(from disk cache)")
```

### Predicted Network Tab Contents

| # | Request | Method | Status | Timing | Notes |
|---|---------|--------|--------|--------|-------|
| 1 | `loremflickr.com/800/800/sunset?lock=...` | GET | 200 | ~2300ms | Preload from click 5 |
| 2 | `loremflickr.com/800/800/golden?lock=...` | GET | 200 | ~2300ms | Preload from click 5 |
| 3 | `loremflickr.com/800/800/autumn?lock=...` | GET | 200 | ~2300ms | Preload from click 5 |
| 4 | `loremflickr.com/800/800/fire?lock=...` | GET | 200 | ~2300ms | Preload from click 5 |
| 5 | `loremflickr.com/800/800/cozy?lock=...` | GET | 200 | ~2300ms | Preload from click 5 |

**Total HTTP requests**: Exactly **5** (one batch from the final click).

**No additional requests from clicks 1–4** — they are silently discarded by the requestId guard before any image preload starts.

After preloads complete, React renders `<img>` tags with the same URLs. The browser serves these from cache — **no new network requests**.

### What the UI Shows

| Time | UI State |
|------|----------|
| 0–300ms | Initial content → skeleton shimmer |
| 300–2300ms | Skeleton shimmer persists |
| ~2300ms | Images appear (no fade-in race, `Promise.all` ensures all 5 ready) |

---

## Conducting the Experiment

1. Run `npm run dev` in the project root
2. Open the URL (usually `http://localhost:5173`)
3. Open DevTools → Network tab → check "Disable cache" (to see raw behavior)
4. Clear the Network tab
5. Click any mood button 5 times as fast as possible
6. Screenshot or note the Network tab contents
7. **Now re-run with cache enabled** (default) to see the cached-behavior difference

### What to Look For

- **Number of requests**: Exactly 5, or more?
- **Request timing**: Do all 5 appear at once (one batch) or staggered?
- **Cached vs uncached**: With cache disabled, do you see only 5? With cache enabled, do preloads and `<img>` renders share cache?
- **Early requests**: Do any images from clicks 1–4 leak through? (They shouldn't — the guard fires before `new Image()`)

---

## Gap Analysis: Prediction vs Reality

### Potential Gaps

| Gap | Likelihood | If It Happens, Why? |
|-----|-----------|---------------------|
| More than 5 requests appear | 🟡 Possible | React StrictMode double-effect in dev mounts App twice → initial `useEffect` fires twice, causing a phantom fetch before any click. Also: if clicks are slow enough (>1500ms apart), each click's batch actually fires. |
| Fewer than 5 requests | 🟡 Possible | Some images fail to load (LoremFlickr 404, network error) → `Promise.all` rejects → `catch` block runs → no images displayed. Also: some preloads may 404 if the keyword returns no results. |
| Clicks arrive in same millisecond | 🔴 Extremely unlikely | Two `fetchImages` calls with same `Date.now()` → `requestIdRef` collision → first request's guard passes (thinks it's still current) → both commit state. Would require two clicks within <1ms. |
| Chrome shows downloaded bytes | 🟡 Notable | With cache enabled, the `<img>` render step shows "(from disk cache)" — zero bytes. But the preload step shows real downloaded bytes. This confirms the single-fetch path. |
| Initial random mood's images also appear | 🔴 Certain | Don't forget the `useEffect` in `App.tsx` fires a `fetchImages` on mount. The Network tab will show 5–10 requests total (5 initial + 5 from final click). |

### Known Limitation of This Prediction

The prediction assumes **all 5 clicks happen within <1500ms** (i.e., before the first timer resolves). If the user clicks slower (e.g., one click per second), clicks 1 and 2 will each fire their own 5-image batch, and clicks 3–5 will be discarded. The Network tab would show **10 requests** (5 + 5 from the first two batches). The prediction above is for the "fastest possible" case.

### Additional Variable: React StrictMode

React StrictMode (wrapping `<App>` in `main.tsx`) double-invokes effects in development. The `useEffect` in `App.tsx` fires twice → calls `handleMoodSelect` twice → two back-to-back `fetchImages` on mount. The second overwrites the first's `requestIdRef`. Result: **only one initial fetch actually completes** (same guard mechanism). No gap, but it adds 5 unexpected requests if you don't account for it.

---

## Verdict

| Metric | Prediction | Reality | Match? |
|--------|-----------|---------|--------|
| Request count (fast clicks, cache disabled) | 5 | TBD | — |
| Request count (slow clicks >1.5s apart) | 5 per click | TBD | — |
| All images arrive in one batch (Promise.all) | Yes | TBD | — |
| Cached renders after preload | Yes (0ms) | TBD | — |
| No stale images from older clicks | Yes (requestId guard) | TBD | — |
| Stale closure on `loading` causes missed dedup | No visible impact | TBD | — |
| First click's abandoned timer calls setLoading? | No (finally guard) | TBD | — |

The code's race-condition defenses (`requestIdRef` guards before every state mutation) make the prediction highly deterministic. The largest source of unpredictability is **human click speed** — whether the user's 5 clicks span <1500ms (one batch) or >1500ms (multiple batches). The second variable is **StrictMode double-effect**, which adds an extra initial fetch in development mode.

---

## Footnote: The Cross-Check Correction

During this tinker analysis, a prior analytical error was discovered and corrected in `docs/04-cross-check.md`:

**Finding #3 (Dual Fetch — Medium severity) was retracted.** The original cross-check claimed `buildImageUrl`'s `Math.random()` caused preload and render URLs to differ. In reality, `buildImageUrl` is called **once** during the `newImages.map()` in `useVibeImages.ts:31`, and the returned URL string is stored in state. Both the preloader (`image.src = img.url`) and the rendered `<img src={image.url}>` reference the **same** string. The browser's HTTP cache serves the second load. No duplicate fetch occurs.

This is a good example of why tinkering (running the code, watching the network) catches what static analysis misses. The cross-check was written at a desk; the tinker was written for the browser.
