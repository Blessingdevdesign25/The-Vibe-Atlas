# 🌌 The Vibe Atlas

**The Vibe Atlas** is a high-end mood board generator designed for creatives. With a single click, it pulls five fresh aesthetic images from across the web, curated to match your chosen mood. No more endless scrolling—just instant inspiration.

## ✨ Features
- **One-Click Inspiration**: Instantly generate 5-image mood boards.
- **Mood-Specific Curations**: Choose from Calm, Loud, Warm, Lonely, or Bright.
- **Premium UX**: Shimmer skeletons, glassmorphic UI, and smooth reveal animations.
- **Smart Fetching**: Deduped requests and intelligent pre-loading for a seamless experience.

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| **Core** | React 18 + Vite |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS (Modern CSS Variables & Glassmorphism) |
| **Images** | LoremFlickr / Unsplash Public API |
| **Hooks** | Custom Data-Fetching (useVibeImages) |

## 🚀 Quick Start
```bash
# Clone the repo
git clone https://github.com/your-repo/vibe-atlas.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📂 File Tree
```text
vibe-atlas/
├── public/
├── src/
│   ├── components/       # UI Components
│   ├── hooks/            # Custom Hooks (Data Fetching)
│   ├── styles/           # Global & Component Styles
│   ├── types/            # TypeScript Definitions
│   ├── utils/            # Utility Functions
│   ├── App.tsx           # Layout Orchestrator
│   └── main.tsx          # Entry Point
└── docs/                 # Engineering Documentation
```

## 🗺️ Roadmap
- [ ] Save/Export mood boards as images.
- [ ] Custom mood input (free-text keywords).
- [ ] Pinterest-style masonry layout option.
- [ ] Collaborative boards via WebSockets.

---
*Designed for those who steal vibes for a living.*
