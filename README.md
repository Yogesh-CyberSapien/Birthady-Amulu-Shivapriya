# Amulu ✦ A Little Magic

A Harry‑Potter‑themed, 3D‑animated birthday page — built with plain **HTML, CSS and JavaScript** (no libraries, no internet needed).

## Files

| File | What it is |
|---|---|
| `index.html` | Structure: envelope gate, hero, first message, photo ring, wish, footer |
| `style.css` | All the looks: night sky, castle, floating candles, gold frames, animations |
| `script.js` | All the motion: starfield, candles, music, 3D carousel, lightbox, sparkle trail |

## Add your photos & music

Put these 8 files **in the same folder as `index.html`** (exact names):

```
pic1.jpg  pic2.jpg  pic3.jpg  pic4.jpg  pic5.jpg  pic6.jpg  pic7.jpg
musicweb.mp3
```

Then open `index.html` in any browser (Chrome, Safari, Edge, Firefox).
Missing files won't break anything — a gold placeholder shows instead, and the music button just stays quiet.

To use different filenames, edit the two places in `index.html`:
the `<img src="pic1.jpg">` tags in the ring, and `<audio src="musicweb.mp3">` at the bottom.

## What happens on the page

1. **The envelope gate** — "Lumos" unlocks the page and starts `musicweb.mp3` (browsers only allow sound after a tap, hence the gate).
2. **Hero** — "Amulu" letters flip in 3D in gold, moon, starfield, shooting stars, a golden snitch, floating candles, Hogwarts silhouette with lit windows.
3. **The first message** — on a parchment card that tilts in 3D as you move the mouse: *"Happy birthday my first baby your Vadhina always love's you"*.
4. **Photo ring** — your 7 photos on a rotating 3D carousel: drag it, use ← → keys or the arrows, tap the front photo to enlarge it, tap a side photo to spin it to the front.
5. **The wish** — a long letter for Amulu, sealed in gold, signed by you.
6. **Footer** — "Mischief managed. Love, however, is not."

Extras: wand sparkle trail follows the cursor, music on/off button bottom‑right, works on phones (swipe the ring), and respects reduce‑motion settings.
