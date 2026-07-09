'use client'

import type { ReactNode } from 'react'
import { useSVGFilter } from '../hooks/useSVGFilter'
import {
  SVG_FILTER_PRESETS,
  type SVGFilterPresetId
} from '../lib/svgFilterPresets'

/**
 * FilterSurface
 *
 * Drop-in wrapper that applies a named SVG filter preset
 * to its children. For presets with an animatedNoise config,
 * pass animate=true to start the useSVGFilter animation loop.
 *
 * Static presets (riso-grain, posterize) ignore animate.
 * The ambient-noise-glass preset is the only one that
 * currently supports animation.
 *
 * Props:
 *   preset   - A valid SVGFilterPresetId from svgFilterPresets.ts
 *   animate  - Enables animation for non-static presets (default false)
 *   className - Additional Tailwind or CSS class names
 *   children  - Any React node
 */
export type FilterSurfaceProps = {
  preset: SVGFilterPresetId
  animate?: boolean
  className?: string
  children: ReactNode
}

export function FilterSurface({
  preset,
  animate = false,
  className = '',
  children
}: FilterSurfaceProps) {
  const presetDef = SVG_FILTER_PRESETS[preset]

  useSVGFilter({
    filterId: presetDef.id,
    result: presetDef.animatedNoise?.result ?? 'ambientNoise',
    enabled: animate && !presetDef.static,
    interval: presetDef.animatedNoise?.interval ?? 220,
    minX: presetDef.animatedNoise?.minX ?? 0.72,
    maxX: presetDef.animatedNoise?.maxX ?? 0.88,
    minY: presetDef.animatedNoise?.minY ?? 0.72,
    maxY: presetDef.animatedNoise?.maxY ?? 0.88
  })

  return (
    <div
      className={className}
      style={{
        filter: presetDef.cssFilter,
        // translateZ(0) promotes element to its own compositor layer
        transform: 'translateZ(0)'
      }}
      data-filter-id={presetDef.id}
      data-filter-category={presetDef.category}
      data-filter-title={presetDef.title}
    >
      {children}
    </div>
  )
}
