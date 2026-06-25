# SVG Filter Cookbook

Complete filter recipes with parameter tuning guides for the SVG Filter Lab.

---

## 1. Glitch Distortion

**Primitives:** `feTurbulence` + `feDisplacementMap`

```html
<filter id="glitch-distort">
  <feTurbulence
    type="fractalNoise"
    baseFrequency="0.18 0.22"
    numOctaves="2"
    result="noise"
  />
  <feDisplacementMap
    in="SourceGraphic"
    in2="noise"
    scale="12"
    xChannelSelector="R"
    yChannelSelector="B"
  />
</filter>
```

**Parameters:**

| Attribute | Safe Range | Notes |
|:---|:---|:---|
| `baseFrequency` | `0.10`–`0.40` | Animate for flickering. Higher = finer grain. |
| `numOctaves` | `1`–`3` | 3 is performance ceiling for animation. |
| `scale` | `8`–`24` | Over 50 causes severe visual fragmentation. |
| `type` | `fractalNoise` | Smoother than `turbulence` for most effects. |

**Animation:**
```js
const t = document.querySelector('#glitch-distort feTurbulence');
setInterval(() => {
  t.setAttribute('baseFrequency', `${(0.12 + Math.random()*0.18).toFixed(3)} ${(0.12 + Math.random()*0.18).toFixed(3)}`);
}, 120);
```

---

## 2. CRT Scanlines

**Primitives:** `feTurbulence` + `feColorMatrix` saturate + `feBlend` multiply + `feComponentTransfer` gamma

```html
<filter id="crt-scanlines">
  <feTurbulence type="fractalNoise" baseFrequency="0 0.8" numOctaves="1" result="scanNoise" />
  <feColorMatrix type="saturate" values="0" in="scanNoise" result="grayNoise" />
  <feBlend mode="multiply" in="SourceGraphic" in2="grayNoise" result="scanlined" />
  <feComponentTransfer in="scanlined">
    <feFuncR type="gamma" amplitude="1.2" exponent="1.5" offset="-0.1" />
    <feFuncG type="gamma" amplitude="1.2" exponent="1.5" offset="-0.1" />
    <feFuncB type="gamma" amplitude="1.2" exponent="1.5" offset="-0.1" />
  </feComponentTransfer>
</filter>
```

**Key insight:** `baseFrequency="0 0.8"` — zero horizontal frequency creates perfectly horizontal bands. The gamma pass boosts contrast to make lines readable.

---

## 3. Chromatic Aberration (RGB Split)

**Primitives:** `feColorMatrix` ×3 + `feOffset` ×2 + `feBlend` screen ×2

```html
<filter id="chromatic-aberration">
  <feColorMatrix type="matrix" values="
    1 0 0 0 0
    0 0 0 0 0
    0 0 0 0 0
    0 0 0 1 0" in="SourceGraphic" result="red" />
  <feOffset in="red" dx="-3" dy="0" result="redShifted" />
  <feColorMatrix type="matrix" values="
    0 0 0 0 0
    0 1 0 0 0
    0 0 0 0 0
    0 0 0 1 0" in="SourceGraphic" result="green" />
  <feColorMatrix type="matrix" values="
    0 0 0 0 0
    0 0 0 0 0
    0 0 1 0 0
    0 0 0 1 0" in="SourceGraphic" result="blue" />
  <feOffset in="blue" dx="3" dy="0" result="blueShifted" />
  <feBlend mode="screen" in="redShifted" in2="green" result="rg" />
  <feBlend mode="screen" in="rg" in2="blueShifted" />
</filter>
```

**Parameters:** `dx` 2–5 for subtle lens aberration; 6–12 for heavy VHS distortion.

---

## 4. Interactive Glass (Specular)

**Primitives:** `feGaussianBlur` + `feSpecularLighting` + `fePointLight` + `feComposite` + `feMerge`

```html
<filter id="glass-specular" x="-20%" y="-20%" width="140%" height="140%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blurred" />
  <feSpecularLighting in="blurred" surfaceScale="5" specularConstant="0.75" specularExponent="20" lighting-color="#ffffff" result="specular">
    <fePointLight x="150" y="-150" z="250" id="glass-light" />
  </feSpecularLighting>
  <feComposite in="specular" in2="SourceAlpha" operator="in" result="maskedSpecular" />
  <feMerge>
    <feMergeNode in="SourceGraphic" />
    <feMergeNode in="maskedSpecular" />
  </feMerge>
</filter>
```

**Interactive JS:** Update `fePointLight` x/y on mousemove:
```js
light.setAttribute('x', Math.round((e.clientX - box.left) * 1.5));
light.setAttribute('y', Math.round((e.clientY - box.top) * -1.5));
```

---

## 5. Risograph Grain

**Primitives:** `feTurbulence` + `feColorMatrix` saturate + `feComponentTransfer` alpha + `feBlend` multiply

```html
<filter id="riso-grain">
  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="rawNoise" />
  <feColorMatrix type="saturate" values="0" in="rawNoise" result="desaturatedGrain" />
  <feComponentTransfer in="desaturatedGrain" result="attenuatedGrain">
    <feFuncA type="linear" slope="0.07" />
  </feComponentTransfer>
  <feBlend mode="multiply" in="SourceGraphic" in2="attenuatedGrain" />
</filter>
```

**Grain intensity:** Adjust `feFuncA slope` — `0.05` for barely-there texture, `0.12` for heavy print grain.

---

## 6. Vintage Ink Posterization

**Primitives:** `feComponentTransfer` discrete + `feTurbulence` + `feColorMatrix` + `feComponentTransfer` alpha + `feBlend`

```html
<filter id="vintage-ink-quantizer">
  <feComponentTransfer in="SourceGraphic" result="posterizedColors">
    <feFuncR type="discrete" tableValues="0.0 0.33 0.66 1.0" />
    <feFuncG type="discrete" tableValues="0.0 0.33 0.66 1.0" />
    <feFuncB type="discrete" tableValues="0.0 0.5 1.0" />
  </feComponentTransfer>
  <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" result="rawNoise" />
  <feColorMatrix type="saturate" values="0" in="rawNoise" result="desaturatedGrain" />
  <feComponentTransfer in="desaturatedGrain" result="boundedGrain">
    <feFuncA type="linear" slope="0.09" />
  </feComponentTransfer>
  <feBlend mode="multiply" in="posterizedColors" in2="boundedGrain" />
</filter>
```

**tableValues:** Fewer values = harder quantization. `0.0 0.5 1.0` gives 3-band vintage look. `0.0 0.25 0.5 0.75 1.0` gives softer 5-band transition.

---

## 7. Combined CRT Matrix (Multi-Pass)

Chains RGB split → glitch displacement → scanlines in one filter graph. Only animate the `glitchNoise` turbulence node — leave scanlines static to minimize per-tick repaint area.

See [demos/combined.html](../demos/combined.html) for full implementation.

---

## Performance Rules

1. Define filters once globally — never duplicate per-component
2. Animate via `setAttribute` in JS — never CSS transitions
3. Keep `numOctaves` ≤ 3 for animated nodes
4. In multi-pass pipelines, only animate the nodes that must change
5. Use `visibilitychange` to pause on hidden tabs
6. Scope filters to individual elements — never to `body` or large containers
7. Add `@supports not` CSS fallback for every filter binding
8. Respect `prefers-reduced-motion: reduce`
