# Glassmorphism Patterns

Glass container variants, CSS specifications, and browser compatibility notes for the SVG Filter Lab.

---

## Dark Glass (Default)

Base specification used across most demos in this project.

```css
.glass-card {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 28px;
  color: #f8fafc;
  transform: translateZ(0);
  transform-style: preserve-3d;
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
```

**Fallback (no backdrop-filter support):**
```css
@supports not (backdrop-filter: blur(1px)) {
  .glass-card { background: rgba(15, 23, 42, 0.95); }
}
```

---

## Light Glass

```css
.glass-card--light {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 12px;
  color: #0f172a;
}
```

---

## Frosted Panel

```css
.glass-card--frosted {
  background: rgba(248, 250, 252, 0.12);
  backdrop-filter: blur(24px) saturate(200%) brightness(1.1);
  -webkit-backdrop-filter: blur(24px) saturate(200%) brightness(1.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

---

## Memphis Glass (Hard Border + Glass Fill)

```css
.glass-card--memphis {
  background: rgba(254, 243, 199, 0.45);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  border: 4px solid #0f172a;
  box-shadow: 12px 12px 0px 0px #0f172a;
  border-radius: 4px;
}
```

---

## Interactive Glass with Specular Lighting

See [demos/glass.html](../demos/glass.html) and `filter-cookbook.md` recipe #4 for full implementation. Requires the `#glass-specular` filter and mouse event listeners in `js/animations.js`.

---

## will-change Policy

Apply `will-change` only during active animation. Use a class toggle:

```js
card.addEventListener('mouseenter', () => card.classList.add('is-animating'));
card.addEventListener('mouseleave', () => card.classList.remove('is-animating'));
```

```css
.glass-card.is-animating { will-change: transform, filter; }
```

Do **not** set `will-change` permanently — it wastes memory and provides no benefit at rest.

---

## Browser Compatibility

| Property | Chrome | Firefox | Safari | Edge | Notes |
|:---|:---:|:---:|:---:|:---:|:---|
| `backdrop-filter` | ✅ 76+ | ✅ 103+ | ✅ 9+ | ✅ 79+ | Use `-webkit-` prefix for Safari < 15.4 |
| `filter: url(#id)` | ✅ | ✅ | ✅ | ✅ | SVG filter reference fully supported |
| `feSpecularLighting` | ✅ | ✅ | ✅ | ✅ | |
| `feTurbulence` animate | ✅ | ✅ | ✅ | ✅ | Via JS setAttribute only |

---

## Performance Notes

- `backdrop-filter` triggers a new stacking context and composite layer — use sparingly on page sections, not on every card
- Combining `backdrop-filter` with `filter: url(#...)` on the same element can cause double composite layer costs in some browsers — test on target devices
- On mobile Safari, heavy `backdrop-filter` blur values (above 30px) can cause frame drops — keep blur at 16–20px for safe mobile performance
