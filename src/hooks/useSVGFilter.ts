'use client'

import { useEffect } from 'react'

/**
 * useSVGFilter
 *
 * Cleanup-safe React hook for animating the baseFrequency
 * attribute of a feTurbulence node inside an SVG filter.
 *
 * Lifecycle:
 *   - On mount (enabled=true): resolves target feTurbulence
 *     node, starts a throttled setInterval, and attaches a
 *     visibilitychange listener that pauses updates when the
 *     tab is hidden.
 *   - On dependency change or unmount: clears the interval
 *     and removes the event listener.
 *
 * React fires cleanup before re-running a changed effect and
 * again on unmount, so no timer or listener leaks.
 *
 * @param filterId        - The SVG filter element's id attribute
 * @param result          - The feTurbulence result name to target
 * @param enabled         - Toggle the animation on/off
 * @param interval        - Update cadence in ms (default 220)
 * @param minX / maxX     - baseFrequency X axis range
 * @param minY / maxY     - baseFrequency Y axis range
 * @param pauseWhenHidden - Auto-pause on hidden tab (default true)
 */

export type UseSVGFilterOptions = {
  filterId: string
  result?: string
  enabled?: boolean
  interval?: number
  minX?: number
  maxX?: number
  minY?: number
  maxY?: number
  pauseWhenHidden?: boolean
}

export function useSVGFilter({
  filterId,
  result = 'ambientNoise',
  enabled = true,
  interval = 220,
  minX = 0.72,
  maxX = 0.88,
  minY = 0.72,
  maxY = 0.88,
  pauseWhenHidden = true
}: UseSVGFilterOptions) {
  useEffect(() => {
    if (!enabled) return

    const turbulence = document.querySelector(
      `#${filterId} feTurbulence[result="${result}"]`
    ) as SVGElement | null

    if (!turbulence) return

    let timer: number | null = null

    const update = () => {
      const fx = (minX + Math.random() * (maxX - minX)).toFixed(3)
      const fy = (minY + Math.random() * (maxY - minY)).toFixed(3)
      turbulence.setAttribute('baseFrequency', `${fx} ${fy}`)
    }

    const start = () => {
      if (timer !== null) return
      update()
      timer = window.setInterval(update, interval)
    }

    const stop = () => {
      if (timer === null) return
      window.clearInterval(timer)
      timer = null
    }

    const onVisibilityChange = () => {
      if (!pauseWhenHidden) return
      if (document.hidden) stop()
      else start()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    start()

    // Cleanup: runs before re-running a changed effect and on unmount.
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [
    enabled,
    filterId,
    result,
    interval,
    minX,
    maxX,
    minY,
    maxY,
    pauseWhenHidden
  ])
}
