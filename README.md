# 🎸 Blues Scale Explorer

**Interactive guitar fretboard diagrams for minor & major blues scales in all 12 keys.**

🌐 **Live site:** https://muzaffergil.github.io/blues-scales/

---

## Features

- **All 12 keys** — select any root note from the dropdown
- **Minor & Major blues** — toggle between the two scale types
- **5 Box positions** — each position rendered in its own fretboard card, showing exactly which frets and fingerings to use
- **Full fretboard view** — see all notes at once across frets 1–12
- **Color coding** — amber = root, blue = "blue note", silver = other scale tones
- **Click to hear** — tap any note dot to hear the pitch via Web Audio API
- **Mobile-friendly** — responsive layout, scrollable diagrams on small screens

---

## Scale Theory

### Minor Blues Scale
Formula: **1 ♭3 4 ♭5 5 ♭7**

| Degree | A blues |
|--------|---------|
| 1      | A       |
| ♭3     | C       |
| 4      | D       |
| ♭5     | D♯ ← **blue note** |
| 5      | E       |
| ♭7     | G       |

The ♭5 (also called the "blue note" or tritone) is the signature sound of the blues — the chromatic passing tone between 4 and 5.

### Major Blues Scale
Formula: **1 2 ♭3 3 5 6**

| Degree | A blues |
|--------|---------|
| 1      | A       |
| 2      | B       |
| ♭3     | C ← **blue note** |
| 3      | C♯      |
| 5      | E       |
| 6      | F♯      |

### 5 Box Positions
The blues scale tiles the entire fretboard through 5 overlapping "box" patterns. Each box is roughly 4–5 frets wide. Learning all 5 lets you play anywhere on the neck without running out of notes.

---

## Run Locally

No build step required — just open `index.html` in a browser:

```bash
# Option 1: double-click index.html
# Option 2: serve locally
python -m http.server 8080
# then visit http://localhost:8080
```

---

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties, grid, flexbox; no frameworks
- **Vanilla JavaScript** — no dependencies, modular files
- **Web Audio API** — note playback on click

---

## Research Sources

- [Guitar Gear Finder — Ultimate Blues Scale Guide](https://guitargearfinder.com/guides/blues-scale/)
- [Applied Guitar Theory — The Blues Scale](https://appliedguitartheory.com/lessons/blues-scale/)
- [Online Guitar Books — A Minor Blues Scale (5 CAGED Positions)](https://onlineguitarbooks.com/a-minor-blues-scale/)
- [Tommy Merry — Connecting the Fretboard: Blues in 5 Positions](https://tommymerry.com/guitar/connecting-entire-fretboard-blues-scale-5-positions/)

---

*Built with pure HTML, CSS & JS — no frameworks, no build tools.*
