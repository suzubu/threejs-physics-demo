# ⚙️ 3D Physics Demo w/ Three.js + Rapier

> A lightweight 3D physics sandbox built with Three.js and Rapier, demonstrating interactive motion, central force attraction, and real-time mouse influence.

---

## 🖼 Preview

![App Preview](media/3d-physics-demo.gif)



---

## ⚙️ Getting Started

These instructions will get the physics playground running locally.

```bash
# 1. Clone the repo
git clone https://github.com/suzubu/3d-physics-demo.git

# 2. Navigate into the project folder
cd threejs-rapier-playground

# 3. No dependencies required if using CDN — just open index.html
open index.html  # or use Live Server in VSCode
```

> Built with:  
> - [Three.js](https://threejs.org/)  
> - [Rapier3D](https://rapier.rs/) (via skypack CDN)  
> - [UnrealBloomPass](https://threejs.org/examples/#webgl_postprocessing_unreal_bloom)

---

## ✨ Features

- 🧩 Procedural generation of 100 dynamic bodies with randomized positions
- 🌀 Central attraction force simulating magnetic or gravity-like pull
- 🖱️ Interactive mouse-controlled collider with glow and light
- 🌠 Real-time rendering with post-processing bloom effects
- ⚙️ No build tools or bundlers — runs with native modules in browser

---

## 💡 Dev Notes

- Uses Rapier3D’s JavaScript-compatible WASM module via Skypack
- Physics and rendering run independently but stay synced via the update loop
- `getBody` and `getMouseBall` are modularized for reuse and clarity
- Designed for quick prototyping without external dependencies or build steps

---

## 📚 Inspiration / Credits

This project was inspired by:

- Rapier’s physics capabilities in WebGL
- Classic Three.js interactive demos
- Experimental motion playgrounds by designers like [Yusuke Hasegawa](https://ykob.dev/)

---

## 🧪 Known Issues

- ⚠️ No UI for modifying parameters — all constants are hardcoded
- 💻 Runs best in modern desktop browsers (Chrome, Firefox)

---

## 🔭 Roadmap / TODO

- [ ] Add GUI controls to tweak number of bodies and force strength
- [ ] Add reset and pause/play options
- [ ] Port to a Vite + module-bundled version

---

## 📂 Folder Structure

```bash
threejs-rapier-playground/
├── getBodies.js         # Creates and updates physics bodies
├── index.js             # Initializes scene, physics, and renderer
├── index.html           # Base HTML file with importmap
├── media/
│   └── preview.gif      # Visual preview (optional)
└── README.md
```

---

## 📜 License

MIT — feel free to use, adapt, and build on this!

---

## 🙋‍♀️ Author

Made with ☕ + 🎧 by [suzubu](https://github.com/suzubu)
Feel free to reach out or fork!
