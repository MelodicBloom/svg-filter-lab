export type SVGFilterPresetId =
  | 'perf-riso-grain'
  | 'perf-posterize'
  | 'perf-ambient-noise-glass'

export type AnimatedNoiseConfig = {
  result: string
  interval: number
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export type SVGFilterPreset = {
  id: SVGFilterPresetId
  title: string
  category: 'texture' | 'color' | 'surface'
  static: boolean
  cssFilter: string
  description: string
  animatedNoise?: AnimatedNoiseConfig
}

export const SVG_FILTER_PRESETS: Record<SVGFilterPresetId, SVGFilterPreset> = {
  'perf-riso-grain': {
    id: 'perf-riso-grain',
    title: 'Risograph Grain',
    category: 'texture',
    static: true,
    cssFilter: 'url(#perf-riso-grain)',
    description:
      'Restrained analog print grain using low-cost fractal noise and alpha attenuation.'
  },
  'perf-posterize': {
    id: 'perf-posterize',
    title: 'Posterization Pass',
    category: 'color',
    static: true,
    cssFilter: 'url(#perf-posterize)',
    description:
      'Discrete channel remapping for stylized print-like tonal compression.'
  },
  'perf-ambient-noise-glass': {
    id: 'perf-ambient-noise-glass',
    title: 'Ambient Noise Glass',
    category: 'surface',
    static: false,
    cssFilter: 'url(#perf-ambient-noise-glass)',
    description:
      'Light-mode frosted glass with subtle texture and soft specular lighting.',
    animatedNoise: {
      result: 'ambientNoise',
      interval: 220,
      minX: 0.72,
      maxX: 0.88,
      minY: 0.72,
      maxY: 0.88
    }
  }
}
