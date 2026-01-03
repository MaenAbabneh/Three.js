# Three.js Rotating Cubes

A minimal Three.js scene rendered via a full-viewport canvas that displays three independently rotating cubes. Bundled with Vite for fast local development and production builds.

## Features
- Three colored cubes created from a shared box geometry
- Continuous rotation driven by `requestAnimationFrame`
- Responsive renderer sizing that keeps the camera aspect correct on resize
- Simple Vite scripts for dev server, build, and preview

## Prerequisites
- Node.js 18+ (LTS recommended)
- npm (comes with Node.js)

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server (Vite):
   ```bash
   npm run dev
   ```
   Then open the shown localhost URL in your browser (usually http://localhost:5173).

## Build & Preview
- Production build:
  ```bash
  npm run build
  ```
- Preview the production build locally:
  ```bash
  npm run preview
  ```

## Project Structure
- `index.html`: Page shell with full-size canvas bound to the renderer.
- `app.js`: Three.js setup (renderer, camera, scene) plus cube creation, animation loop, and resize handling.
- `package.json`: Project metadata and Vite/Three.js dependencies.
- `.gitignore`: Ignores dependencies, build outputs, logs, env files, IDE folders, and lockfiles.

## How It Works
- A `THREE.WebGLRenderer` is attached to the `#c` canvas and sized to the viewport.
- A perspective camera is placed on the Z axis; the scene holds three meshes made from a shared `BoxGeometry` and per-instance `MeshBasicMaterial` colors.
- On each animation frame, cubes rotate at slightly different speeds. The renderer checks for canvas size changes to keep the aspect ratio correct and updates the camera projection when needed.

## Customization Ideas
- Change cube colors or add more instances in `makeInstance`.
- Swap `MeshBasicMaterial` for `MeshStandardMaterial` plus lights for shaded surfaces.
- Adjust the camera position or FOV in `app.js` to frame the scene differently.

## Troubleshooting
- If the canvas is blank, confirm the dev server URL is correct and no console errors appear.
- After resizing the browser, the renderer auto-adjusts; if you disable that, call `renderer.setSize` manually.
