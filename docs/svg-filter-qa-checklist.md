# SVG Filter QA Checklist

Use this checklist before shipping any SVG filter effect to production.

## Architecture
- [ ] Filter defined once in a global `<svg><defs>` block, not repeated inline
- [ ] Filter referenced via `filter="url(#id)"` or CSS `filter: url(#id)`
- [ ] No duplicate filter IDs across the page

## Rendering Scope
- [ ] Filter applied to the smallest possible element
- [ ] `filterUnits` and `primitiveUnits` are explicitly set if needed
- [ ] `x`, `y`, `width`, `height` on the filter element are tightened to avoid excess painted region

## Primitive Budget
- [ ] Each primitive is visually justified — none left over from experimentation
- [ ] `numOctaves` is 3 or below unless there is a clear reason to go higher
- [ ] `feGaussianBlur` `stdDeviation` is as low as the effect allows
- [ ] Chained primitives do not duplicate work (e.g. two blurs where one would do)

## Animation Strategy
- [ ] Surrounding motion uses `transform` and `opacity`, not filter re-evaluation
- [ ] Filter attribute updates are driven by JS with explicit throttling
- [ ] Animation is paused when element is offscreen (`IntersectionObserver`)
- [ ] Animation is paused when tab is hidden (`document.visibilityState`)
- [ ] `requestAnimationFrame` loops are cancelled when not needed

## CSS Hints
- [ ] `will-change: filter` applied only immediately before animation, removed after
- [ ] `contain: paint` or `contain: strict` used on the filter host where appropriate
- [ ] `isolation: isolate` used only where compositing context is needed

## Cross-Device Testing
- [ ] Tested on a mid-range mobile device (not just desktop)
- [ ] Checked in Chrome DevTools with CPU throttling at 4x slowdown
- [ ] No visible jank on scroll when filter is present
- [ ] Frame rate remains at or above 30fps on target devices

## Fallback
- [ ] Graceful degradation if `filter` is unsupported or `prefers-reduced-motion` is set
- [ ] `@media (prefers-reduced-motion: reduce)` disables or simplifies animated filters
