# 🔌 API.md

## Provider: LoremFlickr
We selected **LoremFlickr** for Stage 1 because:
1. No API keys or authentication required.
2. Robust keyword-based filtering.
3. High availability for rapid prototyping.

### URL Pattern
`https://loremflickr.com/{width}/{height}/{keyword}?lock={seed}`

### Mood-to-Keyword Mapping
| Mood | Primary Keywords |
|---|---|
| **Calm** | nature, zen, minimal |
| **Loud** | neon, vibrant, abstract |
| **Warm** | sunset, golden, fire |
| **Lonely** | fog, solitude, void |
| **Bright** | daylight, yellow, high-key |

## URL Construction (`buildImageUrl`)
The utility function randomly selects a keyword from the mood's pool and appends a `lock` parameter. This prevents browser caching from returning the same image for different cards in the same grid.

## Swapping Providers
To swap to **Unsplash**, update `src/utils/buildImageUrl.ts`:
```typescript
// Unsplash Pattern
return `https://source.unsplash.com/featured/800x800/?${keyword}&sig=${randomSeed}`;
```

To swap to **Pexels**, update the `useVibeImages` hook to include the `Authorization` header:
```typescript
const response = await fetch(`https://api.pexels.com/v1/search?query=${mood}&per_page=5`, {
  headers: { Authorization: 'YOUR_API_KEY' }
});
```
