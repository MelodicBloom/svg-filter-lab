---
name: svg-filter-engineer
description: Implement advanced visual effects using SVG filters including displacement maps, turbulence noise, glassmorphism, scanlines, chromatic aberration, and CRT distortion. Use when the user needs SVG-based visual effects, glassmorphic overlays, glitch/distortion filters, scanline textures, or any programmatic image manipulation via SVG primitives. Triggers include requests for SVG filters, displacement maps, glassmorphism, feTurbulence, feDisplacementMap, scanlines, chromatic aberration, or distortion effects.
---

# SVG Filter Effects Engineer

Create advanced visual effects using SVG filter primitives. All effects work on any HTML element through CSS `filter: url(#id)` and are animated via JavaScript `setAttribute` for maximum control.

## Core Filter Primitives

### feTurbulence + feDisplacementMap (The Glitch)
The fundamental distortion effect. Turbulence generates noise; displacementMap warps the source image using that noise.

```html
<filter id="glitch-distort">
  <feTurbulence type="fractalNoise" baseFrequency="0.18 0.22" numOctaves="2" result="noise" />
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="B" />
</filter>
```

**Parameters:**
- `baseFrequency`: 0.1–0.4 for animation. Higher = finer grain.
- `numOctaves`: 1–3. 3 is the performance ceiling for animated nodes.
- `scale`: Displacement strength in pixels. 8–24 for typical use.
- `type`: `"fractalNoise"` for organic noise, `"turbulence"` for sharper patterns.

**Animated flicker (update via JS every 120ms):**
```javascript
const turbulence = document.querySelector('#glitch-distort feTurbulence');
setInterval(() => {
  turbulence.setAttribute('baseFrequency',
    `${(0.12 + Math.random()*0.18).toFixed(3)} ${(0.12 + Math.random()*0.18).toFixed(3)}`
  );
}, 120);
```

### Glassmorphism with Specular Lighting

```html
<filter id="glass-specular" x="-20%" y="-20%" width="140%" height="140%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
  <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.75" specularExponent="20" lighting-color="#ffffff" result="specular">
    <fePointLight x="150" y="-150" z="250" id="glass-light" />
  </feSpecularLighting>
  <feComposite in="specular" in2="SourceAlpha" operator="in" result="maskedSpecular" />
  <feMerge>
    <feMergeNode in="SourceGraphic" />
    <feMergeNode in="maskedSpecular" />
  </feMerge>
</filter>
```

### Chromatic Aberration (RGB Split)

```html
<filter id="chromatic">
  <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
  <feOffset in="red" dx="-3" dy="0" result="redShifted" />
  <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
  <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
  <feOffset in="blue" dx="3" dy="0" result="blueShifted" />
  <feBlend mode="screen" in="redShifted" in2="green" result="rg" />
  <feBlend mode="screen" in="rg" in2="blueShifted" />
</filter>
```

### Scanlines + CRT

```html
<filter id="scanlines">
  <feTurbulence type="fractalNoise" baseFrequency="0 0.8" numOctaves="1" result="noise" />
  <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
  <feBlend mode="multiply" in="SourceGraphic" in2="grayNoise" result="scanlined" />
  <feComponentTransfer in="scanlined">
    <feFuncR type="gamma" amplitude="1.2" exponent="1.5" offset="-0.1" />
    <feFuncG type="gamma" amplitude="1.2" exponent="1.5" offset="-0.1" />
    <feFuncB type="gamma" amplitude="1.2" exponent="1.5" offset="-0.1" />
  </feComponentTransfer>
</filter>
```

### Risograph Grain

```html
<filter id="riso-grain">
  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
  <feColorMatrix type="saturate" values="0" in="noise" result="desaturatedGrain" />
  <feComponentTransfer in="desaturatedGrain">
    <feFuncA type="linear" slope="0.07" />
  </feComponentTransfer>
  <feBlend mode="multiply" in="SourceGraphic" in2="desaturatedGrain" />
</filter>
```

## Workflow

1. Determine the effect needed (glitch, glass, scanlines, chromatic, grain, posterize)
2. Define the SVG filter in a hidden `<svg>` element at the app root — rendered once
3. Apply via CSS `filter: url(#filter-id)` on target elements
4. Animate `baseFrequency` via JS `setAttribute` — never CSS transitions
5. Provide `@supports not` CSS fallbacks
6. Pause animation on `visibilitychange` to save resources
7. Respect `prefers-reduced-motion`

## Performance Rules

- Render SVG filter definitions ONCE globally — never inline per-component
- Animate `baseFrequency` via `setAttribute` in JS — never CSS transitions
- Keep `numOctaves` ≤ 3 for animated turbulence nodes
- In multi-pass pipelines, only update the nodes that must change each tick
- Scope filters to individual elements — never to full-page wrappers
- Use `will-change` only while animation is actively running — remove it at rest
- Test on mid-range mobile devices, not only desktop

## Reference

See `references/filter-cookbook.md` for complete filter recipes with parameter tuning guides.
See `references/glassmorphism-patterns.md` for glass container variants and browser compatibility.
