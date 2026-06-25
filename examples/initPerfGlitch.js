export function initPerfGlitch({
  filterId = 'perf-glitch',
  interval = 120,
  minX = 0.12,
  maxX = 0.28,
  minY = 0.12,
  maxY = 0.28,
} = {}) {
  const turbulence = document.querySelector(`#${filterId} feTurbulence[result="noise"]`)
  if (!turbulence) return () => {}

  let timer = null

  const update = () => {
    const fx = (minX + Math.random() * (maxX - minX)).toFixed(3)
    const fy = (minY + Math.random() * (maxY - minY)).toFixed(3)
    turbulence.setAttribute('baseFrequency', `${fx} ${fy}`)
  }

  const start = () => {
    if (timer) return
    update()
    timer = window.setInterval(update, interval)
  }

  const stop = () => {
    if (!timer) return
    window.clearInterval(timer)
    timer = null
  }

  const onVisibility = () => {
    if (document.hidden) stop()
    else start()
  }

  document.addEventListener('visibilitychange', onVisibility)
  start()

  return () => {
    stop()
    document.removeEventListener('visibilitychange', onVisibility)
  }
}
