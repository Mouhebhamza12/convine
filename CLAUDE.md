# Convine — working rules

Convine is a paid digital wedding-invitation product. Templates live in
`frontend/src/templates/<slug>/` with a stylesheet in `frontend/src/css/<slug>.css`,
registered in `lib/templates.js`, `lib/resolveInvitation.js` (demo tokens),
`pages/InvitationPage.jsx` (TEMPLATE_VIEWS), `pages/CreateCustomerPage.jsx`
(dropdown), and previewed in `components/TemplateDemoSection.jsx`.

## Design doctrine — SVG-first, stationery-grade

Think like a graphic designer at a luxury stationery house, not a frontend
developer. The bar is Paperless Post / Minted / Greenvelope / Rifle Paper Co.:
the result must feel printed by a professional stationery designer.

**Never use CSS borders, pseudo-elements, gradients-as-art, or div decorations
to create ornamental design.** CSS is for layout and typography only.

When a decorative element is needed:
1. Search for a suitable open-source SVG (verify the file is truly vector /
   truly transparent — rawpixel `image_png_1300` hotlinks bake a fake
   checkerboard into the pixels; never use them).
2. If none fits, generate a custom SVG.
3. If still unsuitable, draw the SVG illustration manually, path by path.

Never leave a section without visual assets.

Every invitation template must contain **at least 3 custom SVG assets**, drawn
from this set:
- Custom frame artwork (cartouche, arch, wreath…)
- Decorative corner ornaments
- Line-art couple illustration
- Floral accents
- Monogram artwork
- Decorative dividers
- Envelope / card / icons as needed

Templates must generate their own artwork — never depend on the customer
supplying images for the design to hold up.

Composition rules:
- Premium typography pairing (display serif/script + quiet sans or serif body).
- Print-quality composition: tight, intentional spacing; no big empty voids.
- No placeholder graphics, no startup-SaaS aesthetics, no generic Tailwind
  layouts, no plain cards.
- Each template keeps its own distinct identity (palette, fonts, ornament
  language) — never clone another template's look.

Asset components are reusable: keep each template's SVG art in a dedicated
`<Slug>Art.jsx` / `<Slug>Botanicals.jsx` module, one exported component per
asset, stroked with `currentColor` so CSS sets the palette.

## Workflow notes

- The owner verifies visuals in their own browser; don't claim a design
  matches until they confirm. Build with `npm run build` in `frontend/` to
  validate before handing back.
- Secrets live in `.env` (gitignored). Never hardcode or commit keys.
