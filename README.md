# ❶ VOXX NEXUS — Digital Technology Studio

A static, Vercel/GitHub-ready futuristic studio website using a real Three.js + GLB WebGL scene.

## Included
- Real-time 3D NEXUS CORE using `assets/voxx-nexus-core.glb`
- Animated holographic shell + procedural energy shader
- Orbital mechanical rings, floating fragments, particles and cinematic lighting
- Reference-inspired HUD / module rail / glass panels
- Profile / Web Systems / AI / API Network / Automation / Creative Engine
- Selected Work / Pricing / Contact
- Email / Instagram / WhatsApp / Telegram contact cards
- Responsive mobile navigation and adaptive WebGL quality
- Reduced-motion support
- No build step required

## Project structure
```text
voxx-nexus/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── voxx-nexus-core.glb
```

## Before publishing
Open `script.js` and replace the `CONTACT` values:
- `email`
- `instagram`
- `whatsapp`
- `telegram`

The pricing values in `index.html` are **illustrative starting prices**. Change them to your real service fees before publishing.

## Local preview
```bash
python3 -m http.server 8080
```
Then open `http://127.0.0.1:8080`.

Do not open the HTML as `file://` if you want the GLB/module imports to load reliably.

## Vercel
Import the GitHub repository into Vercel. No framework preset or build command is required; deploy the repository as a static site.

## GitHub
The repository can remain public or private. The site itself contains no server secrets.
