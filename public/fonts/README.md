# Fonts

## New Spirit

**New Spirit** by Sharp Type is the display serif used in every `<h1>`–`<h6>` and
editorial numeral throughout the app. The following OTF files are already in place:

```
NewSpirit-Light.otf        → font-weight: 300
NewSpirit-Regular.otf      → font-weight: 400
NewSpirit-Medium.otf       → font-weight: 500
NewSpirit-SemiBold.otf     → font-weight: 600
NewSpirit-Bold.otf         → font-weight: 700
NewSpirit-Condensed.otf    → not wired up; reserved for future display variants
```

### Optional: convert to woff2 for production

OTF works in every modern browser but the files are ~300 KB each. For production
consider compressing to woff2 (~70 KB each):

```bash
# macOS / Linux — requires fonttools (pip install fonttools brotli)
for f in NewSpirit-Light NewSpirit-Regular NewSpirit-Medium NewSpirit-SemiBold NewSpirit-Bold; do
  pyftsubset "$f.otf" --output-file="$f.woff2" --flavor=woff2 --layout-features='*' --unicodes='*'
done
```

Then swap `url("/fonts/NewSpirit-*.otf") format("opentype")` →
`url("/fonts/NewSpirit-*.woff2") format("woff2")` in `src/app/globals.css`.

### Licensing

New Spirit is a licensed typeface. Confirm the license covers web embedding on
production domains before going live (https://sharptype.co/typefaces/new-spirit).
Before open-sourcing this repo, uncomment the font ignore rule in `.gitignore` so
font files aren't committed to a public repository.

## Plus Jakarta Sans + JetBrains Mono

Loaded at runtime via `next/font/google` in `src/app/layout.tsx` — no local files
needed. Exposed as CSS variables `--font-sans` and `--font-mono`.
