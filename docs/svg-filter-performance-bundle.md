# SVG Filter Performance Bundle

This bundle contains:

- `docs/how-to-implement-performant-svg-filters-without-killing-your-frame-rate.md`
- `docs/svg-filter-qa-checklist.md`
- `examples/optimized-filters.svg`
- `examples/initPerfGlitch.js`
- `examples/index.html`

## Notes

The filters in this bundle are intentionally conservative. They are designed as strong production-safe starting points rather than maximalist demo settings.

## QA outcomes

- Globalized filter definitions: pass
- Conservative `numOctaves`: pass
- Small-scope application: pass
- Throttled JavaScript updates: pass
- `will-change` used only during interaction: pass
- Fallback behavior included: pass
