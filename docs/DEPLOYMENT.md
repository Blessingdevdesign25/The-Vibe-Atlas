# 🚀 Deployment Guide

The Vibe Atlas is configured for automated deployment via GitHub Actions.

## GitHub Pages Setup
The project includes a `.github/workflows/deploy.yml` file that automatically builds and deploys the site whenever you push to the `master` branch.

### To enable:
1. Push your code to a GitHub repository.
2. Go to **Settings > Pages** in your GitHub repo.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. The next time you push to `master`, the action will trigger and your site will be live!

## Branch-Based Deployment
By setting `base: './'` in `vite.config.ts`, the application is "path-agnostic." This means you can deploy it to:
- A root domain (e.g., `vibeatlas.com`)
- A subpath (e.g., `user.github.io/vibe-atlas/`)
- A staging branch (e.g., `staging.vibeatlas.com`)

All assets (CSS, JS, Images) will load correctly using relative paths.

## Manual Build
If you need to build the site manually for Vercel, Netlify, or a different server:
```bash
npm run build
```
The production-ready files will be generated in the `dist/` folder.
