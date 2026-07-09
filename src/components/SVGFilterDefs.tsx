'use client'

export function SVGFilterDefs() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>

        {/* ─────────────────────────────────────────────
            perf-riso-grain
            Category : texture
            Technique: fractalNoise → grayscale → alpha
                       attenuation → multiply blend
            Static   : yes
            Use on   : editorial cards, poster frames,
                       art-direction overlays
        ───────────────────────────────────────────── */}
        <filter id="perf-riso-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.58"
            numOctaves={2}
            stitchTiles="stitch"
            result="risoNoise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="risoNoise"
            result="grayNoise"
          />
          <feComponentTransfer in="grayNoise" result="grain">
            {/* slope=0.065 keeps grain density supportive, not dominant */}
            <feFuncA type="linear" slope={0.065} />
          </feComponentTransfer>
          <feBlend mode="multiply" in="SourceGraphic" in2="grain" />
        </filter>

        {/* ─────────────────────────────────────────────
            perf-posterize
            Category : color
            Technique: feComponentTransfer discrete
                       channel maps — R×4 G×4 B×3 steps
            Static   : yes
            Use on   : artwork, illustration, pop/print
                       compositions
        ───────────────────────────────────────────── */}
        <filter id="perf-posterize" x="0%" y="0%" width="100%" height="100%">
          <feComponentTransfer in="SourceGraphic">
            <feFuncR type="discrete" tableValues="0 0.33 0.66 1" />
            <feFuncG type="discrete" tableValues="0 0.33 0.66 1" />
            {/* 3-step blue quantization for warmer print contrast */}
            <feFuncB type="discrete" tableValues="0 0.5 1" />
          </feComponentTransfer>
        </filter>

        {/* ─────────────────────────────────────────────
            perf-ambient-noise-glass
            Category : surface
            Technique: blur → alpha-shape glass body →
                       low-opacity noise layer →
                       multiply blend → specular highlight
                       → mask + merge
            Static   : no (ambientNoise node is animated
                       via useSVGFilter when animate=true)
            Use on   : light-mode panels, floating nav,
                       premium dashboard cards
        ───────────────────────────────────────────── */}
        <filter
          id="perf-ambient-noise-glass"
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
        >
          {/* stdDeviation=2.5: softens without muddying */}
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={2.5}
            result="glassBlur"
          />

          {/* alpha=0.18: airy body for light-mode surfaces */}
          <feColorMatrix
            in="glassBlur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 0.18 0"
            result="glassBody"
          />

          {/* baseFrequency=0.8, numOctaves=1:
              fine static grain; result name 'ambientNoise'
              is the target for useSVGFilter setAttribute */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves={1}
            stitchTiles="stitch"
            result="ambientNoise"
          />

          <feColorMatrix
            type="saturate"
            values="0"
            in="ambientNoise"
            result="ambientGray"
          />

          {/* slope=0.025: very restrained — avoids contaminating text */}
          <feComponentTransfer in="ambientGray" result="ambientTexture">
            <feFuncA type="linear" slope={0.025} />
          </feComponentTransfer>

          <feBlend
            mode="multiply"
            in="glassBody"
            in2="ambientTexture"
            result="texturedGlass"
          />

          {/* surfaceScale=3, specularConstant=0.45, specularExponent=14:
              broad soft highlight, not a sharp focal point */}
          <feSpecularLighting
            in="glassBlur"
            surfaceScale={3}
            specularConstant={0.45}
            specularExponent={14}
            lightingColor="#ffffff"
            result="specular"
          >
            <fePointLight x={80} y={-60} z={140} />
          </feSpecularLighting>

          <feComposite
            in="specular"
            in2="SourceAlpha"
            operator="in"
            result="specularMasked"
          />

          <feComposite
            in="texturedGlass"
            in2="SourceAlpha"
            operator="in"
            result="glassMasked"
          />

          <feMerge>
            <feMergeNode in="glassMasked" />
            <feMergeNode in="specularMasked" />
          </feMerge>
        </filter>

      </defs>
    </svg>
  )
}
