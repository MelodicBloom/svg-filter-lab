# svg-filter-lab

> Interactive SVG filter primitives showcase — sculpting nature with code.

A complete reference implementation for performant SVG filter animations using JavaScript and CSS. Covers glitch distortion, CRT scanlines, chromatic aberration, interactive specular glass, risograph grain, and vintage ink posterization — all running on native browser primitives with zero dependencies.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue)](https://qt314wink.github.io/svg-filter-lab/)

---

## Filter Index

| Demo | Effect | File |
|:---|:---|:---|
| Glitch Distortion | feTurbulence + feDisplacementMap | [demos/glitch.html](demos/glitch.html) |
| CRT Scanlines | fractalNoise multiply blend | [demos/crt.html](demos/crt.html) |
| Chromatic Aberration | feColorMatrix + feOffset + feBlend screen | [demos/chromatic.html](demos/chromatic.html) |
| Interactive Glass | feSpecularLighting + fePointLight mouse tracking | [demos/glass.html](demos/glass.html) |
| Memphis + Risograph | feComponentTransfer grain + block shadow | [demos/memphis.html](demos/memphis.html) |
| Vintage Ink Print | feComponentTransfer discrete posterization | [demos/posterize.html](demos/posterize.html) |
| Combined CRT Matrix | RGB split + glitch + scanlines in one graph | [demos/combined.html](demos/combined.html) |

---

## Quick Start

```bash
# Clone and open locally — no build step required
git clone https://github.com/qt314wink/svg-filter-lab.git
cd svg-filter-lab
open index.html
```

Or visit the [live GitHub Pages demo](https://qt314wink.github.io/svg-filter-lab/).

---

## Architecture

```
svg-filter-lab/
├── index.html               # Landing page — all demos linked
├── css/
│   └── styles.css           # Element bindings, fallbacks, will-change logic
├── js/
│   └── animations.js        # setAttribute animation controllers
├── demos/
│   ├── glitch.html
│   ├── crt.html
│   ├── chromatic.html
│   ├── glass.html
│   ├── memphis.html
│   ├── posterize.html
│   └── combined.html
├── references/
│   ├── filter-cookbook.md   # Complete filter recipes + parameter tuning
│   └── glassmorphism-patterns.md
└── docs/
    └── SKILL.md             # SVG Filter Engineer skill definition
```

---

## Performance Rules

- Define SVG filters **once** globally — never inline per-component
- Animate `baseFrequency` via `setAttribute` in JS — never CSS transitions
- Keep `numOctaves` at **3 or below** for any animated turbulence node
- Scope filters to individual elements — never apply to full-page wrappers
- Use `will-change` only while an element is **actively animating**
- Pause animation on hidden tabs via `visibilitychange`
- Always provide `@supports not` CSS fallback
- Test on mid-range mobile, not just desktop
- Respect `prefers-reduced-motion`

---

## Parameter Tuning Reference

| Parameter | Starting Range | What It Controls |
|:---|:---|:---|
| `numOctaves` | `1` to `3` | Noise detail. Higher = exponentially more expensive. |
| `baseFrequency` | `0.10` to `0.40` | Density of the noise field. Lower = broader waves. |
| `scale` (feDisplacementMap) | `8` to `24` | Displacement intensity in pixels. |
| `dx` / `dy` (feOffset) | `2` to `5` | RGB channel split width for chromatic aberration. |
| Grain slope (feFuncA) | `0.05` to `0.10` | Analog grain density. |

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|:---|:---:|:---:|:---:|:---:|
| SVG filter via CSS | ✅ | ✅ | ✅ | ✅ |
| feTurbulence animation | ✅ | ✅ | ✅ | ✅ |
| feSpecularLighting | ✅ | ✅ | ✅ | ✅ |
| backdrop-filter fallback | ✅ | ✅ | ✅ | ✅ |

---

## Related Article

[How Do I Implement Performant SVG Filter Animations Using JavaScript and CSS?](https://substack.com) — Full Q&A guide on Substack.

---

## License

MIT
