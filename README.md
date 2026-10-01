# LUMORA — Memories in Motion

A premium cinematic photo gallery, memory album, and ambient musical experience designed for static hosting on **GitHub Pages**.

---

## Features

- **Cinematic Memory Mode**: Automatic full-screen slideshow with customizable pace (3s, 5s, 8s, 10s), atmospheric music sync, dynamic blurred background, and subtle captions.
- **Ken Burns Motion System**: Smooth, randomized pan-and-zoom animations that bring still photographs into motion without distortion.
- **Ambient Soundtrack Player**: Built-in procedural ambient synthesizer and HTML5 audio player with Web Audio FFT visualizer, floating mini-player, and full glassmorphic controls.
- **Curated Collections & Timeline**: Categorized photo albums and chronological timeline grouped by month and year.
- **Custom Album & Media Studio**: Create custom albums with image uploads (JPG, PNG, WEBP) and soundtracks (MP3, WAV, M4A, OGG) stored locally in browser IndexedDB.
- **Zero Backend Required**: 100% client-side architecture with IndexedDB and localStorage persistence. Works completely offline once loaded.
- **GitHub Pages Ready**: Configured with relative asset base paths and hash-based routing (`#/albums`, `#/memory/:id`) to prevent 404 errors upon direct link refresh.
- **Five Aesthetic Themes**: Cinematic (Amber), Dreamy (Lavender), Midnight (Cyan), Minimal (Monochrome), and Retro (Kodachrome).

---

## Quick Start & Local Development

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm or yarn

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Locally
```bash
npm run dev
```
Open `http://localhost:3000` (or the port specified by Vite) in your browser.

---

## Production Build & Static Testing

To create the production build for static hosting:

```bash
npm run build
```

This compiles all assets into the `/dist` directory with relative paths (`./assets/...`), allowing it to be served from any subdirectory or GitHub Pages repository path.

To preview the production build locally:
```bash
npm run preview
```

---

## Deploying to GitHub Pages (Free)

### Method A: Automated Deployment via GitHub Actions (Recommended)

1. Create a new GitHub repository (e.g. `lumora`).
2. Push this project code to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Lumora"
   git branch -M main
   git remote add origin https://github.com/<your-username>/lumora.git
   git push -u origin main
   ```
3. In your GitHub repository, navigate to **Settings** > **Pages**.
4. Under **Build and deployment** > **Source**, select **GitHub Actions**.
5. The included workflow (`.github/workflows/deploy.yml`) will automatically run upon every push, build the static site, and publish it live!

### Method B: Manual Deployment via `gh-pages` Branch

1. Run `npm run build`.
2. Push the contents of the `dist/` directory to the `gh-pages` branch:
   ```bash
   npx gh-pages -d dist
   ```
3. In your repository **Settings** > **Pages**, choose Deploy from branch: `gh-pages` / `root`.

---

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Audio**: Web Audio API (ambient chord synth + FFT analyser) & HTML5 Audio
- **Icons**: Lucide React
- **Storage**: IndexedDB (media blobs & custom albums) + localStorage (favorites & settings)
