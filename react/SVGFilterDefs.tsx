/**
 * SVGFilterDefs — drop once at app root (layout.tsx, _app.tsx, or App.tsx)
 * All six filters become globally available via CSS: filter: url(#id)
 */
export function SVGFilterDefs() {
  return (
    <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <filter id="perf-glitch" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.16 0.22" numOctaves={2} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={10} xChannelSelector="R" yChannelSelector="B" />
        </filter>
        <filter id="perf-crt-glitch" x="-15%" y="-15%" width="130%" height="130%">
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" in="SourceGraphic" result="red" />
          <feOffset in="red" dx={-2} dy={0} result="redShift" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" in="SourceGraphic" result="green" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" in="SourceGraphic" result="blue" />
          <feOffset in="blue" dx={2} dy={0} result="blueShift" />
          <feBlend mode="screen" in="redShift" in2="green" result="rg" />
          <feBlend mode="screen" in="rg" in2="blueShift" result="rgbSplit" />
          <feTurbulence type="fractalNoise" baseFrequency="0.16 0.22" numOctaves={2} result="noise" />
          <feDisplacementMap in="rgbSplit" in2="noise" scale={10} xChannelSelector="R" yChannelSelector="B" result="glitched" />
          <feTurbulence type="fractalNoise" baseFrequency="0 0.8" numOctaves={1} result="scanNoise" />
          <feColorMatrix type="saturate" values="0" in="scanNoise" result="scanGray" />
          <feBlend mode="multiply" in="glitched" in2="scanGray" />
        </filter>
        <filter id="perf-glass" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={3} result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.28 0" result="glassBody" />
          <feSpecularLighting in="blur" surfaceScale={4} specularConstant={0.6} specularExponent={18} lightingColor="#ffffff" result="specular">
            <fePointLight x={100} y={-100} z={180} />
          </feSpecularLighting>
          <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularMasked" />
          <feComposite in="glassBody" in2="SourceAlpha" operator="in" result="glassMasked" />
          <feMerge>
            <feMergeNode in="glassMasked" />
            <feMergeNode in="specularMasked" />
          </feMerge>
        </filter>
        <filter id="perf-riso-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency={0.65} numOctaves={3} stitchTiles="stitch" result="rawNoise" />
          <feColorMatrix type="saturate" values="0" in="rawNoise" result="neutralGrain" />
          <feComponentTransfer in="neutralGrain" result="attenuatedGrain">
            <feFuncA type="linear" slope={0.08} />
          </feComponentTransfer>
          <feBlend mode="multiply" in="SourceGraphic" in2="attenuatedGrain" />
        </filter>
        <filter id="perf-posterize" x="0%" y="0%" width="100%" height="100%">
          <feComponentTransfer in="SourceGraphic" result="posterized">
            <feFuncR type="discrete" tableValues="0.0 0.25 0.5 0.75 1.0" />
            <feFuncG type="discrete" tableValues="0.0 0.25 0.5 0.75 1.0" />
            <feFuncB type="discrete" tableValues="0.0 0.45 1.0" />
          </feComponentTransfer>
          <feTurbulence type="fractalNoise" baseFrequency={0.72} numOctaves={2} stitchTiles="stitch" result="printNoise" />
          <feColorMatrix type="saturate" values="0" in="printNoise" result="neutralPrintNoise" />
          <feComponentTransfer in="neutralPrintNoise" result="boundedPrintNoise">
            <feFuncA type="linear" slope={0.06} />
          </feComponentTransfer>
          <feBlend mode="multiply" in="posterized" in2="boundedPrintNoise" />
        </filter>
        <filter id="perf-ambient-glass-light" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={2.5} result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.22 0" result="glassBody" />
          <feSpecularLighting in="blur" surfaceScale={3} specularConstant={0.5} specularExponent={16} lightingColor="#e0f2fe" result="specular">
            <fePointLight x={120} y={-80} z={160} id="ambient-glass-light-source" />
          </feSpecularLighting>
          <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularMasked" />
          <feComposite in="glassBody" in2="SourceAlpha" operator="in" result="glassMasked" />
          <feMerge>
            <feMergeNode in="glassMasked" />
            <feMergeNode in="specularMasked" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}
