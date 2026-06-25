# SVG Filter QA Checklist

Use this checklist during implementation review, pull request review, or performance QA for any UI that depends on SVG filters.

## Architecture

- [ ] Filter definitions live once in a global hidden SVG block.
- [ ] Filter IDs are stable and descriptive.
- [ ] Filters are not duplicated per component instance.
- [ ] Fallback styles exist for unsupported or low-performance contexts.

## Rendering Scope

- [ ] Filters are scoped to the smallest realistic element.
- [ ] Full-page or full-section filter application has been avoided or justified.
- [ ] Filter region bounds (`x`, `y`, `width`, `height`) are not excessively oversized.
- [ ] Text remains legible under the active effect.

## Primitive Budget

- [ ] Every primitive contributes visibly to the final effect.
- [ ] `numOctaves` is `3` or lower unless benchmarked otherwise.
- [ ] `feGaussianBlur` values are restrained.
- [ ] `feSpecularLighting` is used only where the surface effect really needs it.
- [ ] Chromatic split and scanline layers are not stacked without visual justification.

## Animation Strategy

- [ ] Filter internals are updated through JavaScript only when needed.
- [ ] Update frequency is throttled for flicker-style effects.
- [ ] Effects pause on hidden tabs or offscreen elements.
- [ ] `transform` and `opacity` handle surrounding UI motion.
- [ ] Animation does not depend on layout-triggering properties for core motion.

## CSS Hints

- [ ] `will-change` is applied shortly before animation, not permanently.
- [ ] `transform: translateZ(0)` or equivalent compositing hints are used selectively.
- [ ] Hover or interaction states clean up temporary classes after animation completes.

## Cross-Device QA

- [ ] Effect has been tested on a low-powered laptop or mobile device.
- [ ] Effect remains readable at reduced refresh conditions.
- [ ] Fallback state is visually acceptable when the SVG filter is disabled.
- [ ] DevTools paint and rendering views were checked during animation.
