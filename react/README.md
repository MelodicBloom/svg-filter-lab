# React Integration

Drop `<SVGFilterDefs />` once at app root, then use `useSVGFilter` in any component.

## Setup

```tsx
// app/layout.tsx
import { SVGFilterDefs } from '@/svg-filter-lab/react/SVGFilterDefs'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SVGFilterDefs />
        {children}
      </body>
    </html>
  )
}
```

## Apply via CSS

```css
.glitch-card  { filter: url(#perf-glitch); transform: translateZ(0); }
.riso-surface { filter: url(#perf-riso-grain); }
.print-card   { filter: url(#perf-posterize); }
.glass-light  { filter: url(#perf-ambient-glass-light); backdrop-filter: blur(14px); }
```

## useSVGFilter — auto-start

```tsx
import { useSVGFilter } from '@/svg-filter-lab/react/useSVGFilter'

export function GlitchCard() {
  useSVGFilter({ filterId: 'perf-glitch', interval: 130 })
  return <div className="glitch-card">Content</div>
}
```

## useSVGFilter — interaction-driven with will-change

```tsx
import { useState } from 'react'
import { useSVGFilter } from '@/svg-filter-lab/react/useSVGFilter'

export function CRTCard() {
  const [primed, setPrimed] = useState(false)
  const { start, stop } = useSVGFilter({ filterId: 'perf-crt-glitch', autoStart: false })

  return (
    <div
      className="crt-card"
      style={primed ? { willChange: 'filter, transform' } : undefined}
      onPointerEnter={() => { setPrimed(true); start() }}
      onPointerLeave={() => { stop(); setPrimed(false) }}
    >
      Content
    </div>
  )
}
```

## Filter reference

| ID | Effect | Animated |
|---|---|---|
| `perf-glitch` | Turbulence displacement | Yes |
| `perf-crt-glitch` | RGB split + displacement + scanlines | Yes |
| `perf-glass` | Dark-mode specular glass | Optional |
| `perf-riso-grain` | Analog risograph grain | No — static |
| `perf-posterize` | Vintage ink-print quantization | No — static |
| `perf-ambient-glass-light` | Light-mode ambient glass | Optional |

## QA notes

- All filters use tight region bounds to minimize paint area
- `numOctaves` is 2 or lower for animated filters, 3 max for static grain
- `will-change` is never applied statically — always interaction-driven
- `useSVGFilter` auto-pauses on `visibilitychange` and cleans up on unmount
