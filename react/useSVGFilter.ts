import { useEffect, useRef, useCallback } from 'react'

export interface UseSVGFilterOptions {
  filterId: string
  turbulenceSelector?: string
  interval?: number
  minX?: number
  maxX?: number
  minY?: number
  maxY?: number
  autoStart?: boolean
}

export interface UseSVGFilterReturn {
  start: () => void
  stop: () => void
  isRunning: () => boolean
}

/**
 * useSVGFilter
 * Drives performant feTurbulence baseFrequency animation on a globally defined SVG filter.
 * Auto-pauses on hidden tab. Full cleanup on unmount.
 */
export function useSVGFilter({
  filterId,
  turbulenceSelector = '',
  interval = 120,
  minX = 0.12,
  maxX = 0.28,
  minY = 0.12,
  maxY = 0.28,
  autoStart = true,
}: UseSVGFilterOptions): UseSVGFilterReturn {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getTurbulence = useCallback((): SVGFETurbulenceElement | null => {
    const selector = turbulenceSelector
      ? `#${filterId} feTurbulence${turbulenceSelector}`
      : `#${filterId} feTurbulence`
    return document.querySelector<SVGFETurbulenceElement>(selector)
  }, [filterId, turbulenceSelector])

  const update = useCallback(() => {
    const node = getTurbulence()
    if (!node) return
    const fx = (minX + Math.random() * (maxX - minX)).toFixed(3)
    const fy = (minY + Math.random() * (maxY - minY)).toFixed(3)
    node.setAttribute('baseFrequency', `${fx} ${fy}`)
  }, [getTurbulence, minX, maxX, minY, maxY])

  const stop = useCallback(() => {
    if (timerRef.current === null) return
    clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  const start = useCallback(() => {
    if (timerRef.current !== null) return
    update()
    timerRef.current = setInterval(update, interval)
  }, [update, interval])

  const isRunning = useCallback(() => timerRef.current !== null, [])

  useEffect(() => {
    if (autoStart) start()
    const handleVisibility = () => {
      if (document.hidden) stop()
      else if (autoStart) start()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [autoStart, start, stop])

  return { start, stop, isRunning }
}
