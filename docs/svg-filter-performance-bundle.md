# SVG Filter Performance Bundle

Reusable performant filter definitions. Drop into a hidden `<svg><defs>` block.

## Filters Included

- `#grain` — subtle fractalNoise grain overlay
- `#distort-sm` — light displacement for hover states
- `#distort-lg` — strong displacement for hero/glitch
- `#glow` — soft gaussian glow via feFlood + feComposite
- `#sharpen` — convolution sharpening kernel

## Usage

```html
<!-- Include once in your layout -->
<svg style="position:absolute;width:0;height:0" aria-hidden="true">
  <defs>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" result="gray"/>
      <feBlend in="SourceGraphic" in2="gray" mode="multiply"/>
    </filter>
    <filter id="distort-sm">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="distort-lg">
      <feTurbulence id="distort-lg-turb" type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="glow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur"/>
      <feFlood flood-color="#00e5ff" flood-opacity="0.5" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="glow"/>
      <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="sharpen">
      <feConvolveMatrix order="3" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" preserveAlpha="true"/>
    </filter>
  </defs>
</svg>

<!-- Then reference anywhere -->
<div style="filter: url(#grain)">...</div>
<h1 style="filter: url(#glow)">...</h1>
```
