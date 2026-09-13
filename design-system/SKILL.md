---
name: nora-suleiman-home-beauty-design
description: Use this skill to generate well-branded interfaces and assets for Nora Suleiman Home Beauty — a women-only home-beauty marketplace in Saudi Arabia (Arabic RTL, rose + gold). Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for production code or throwaway prototypes/mocks.
user-invocable: true
---

# Nora Suleiman Home Beauty — design skill

Read the `README.md` file at this skill's root first, then explore the other available files:

- `styles.css` — the single entry stylesheet (link this in any HTML page).
- `tokens/` — colors, typography, spacing, icons, base resets. Every CSS custom property a design needs is here.
- `guidelines/` — small specimen cards for palette, type, spacing, brand.
- `components/` — reusable React primitives (Button, ProviderCard, BookingCard, BottomNavBar, …). Each has a `.jsx`, a `.d.ts` props contract, and most have a short `.prompt.md` usage note.
- `ui_kits/client-app/` — an interactive client mobile-app recreation (RTL Arabic, iOS frame) — copy from this when you need a starting screen.
- `docs/` — the original Smart Lead Tech blueprint (product brief, full design-system spec, user flows, mobile screens, API contracts). Open these when a question isn't answered in `README.md`.

## How to use it

**If you are creating visual artifacts** (slides, mocks, throwaway prototypes, marketing pages, etc):
- Copy assets out of this skill (icons via the included Material Symbols Rounded font, the typographic logo lockup, the gradient placeholder patterns) and write static HTML files for the user to view.
- Link `styles.css` and consume the CSS custom properties (`--primary-500`, `--bg-tint`, `--space-4`, `--radius-lg`, `--elevation-2`, etc.). Don't hardcode hex values.
- Use Tajawal for Arabic, Inter for Latin / numerals. Arabic-Indic digits in `ar`; bidi-isolate any numeric run inside Arabic text.

**If you are working on production code** (React Native / Expo client + provider apps, or the Next.js web portal):
- Copy the components you need into the target codebase and read `docs/blueprint/02-design-system/04-components.md` for the full anatomy/states/RTL contract behind each one.
- Generate React-Native equivalents from these React components — the prop shapes carry over; the styling reads directly from the same token names.
- For new screens, start from `docs/blueprint/04-mobile-screens/` (client, provider, shared).

## Voice & content rules (must follow)

- Arabic-first, RTL-native. Feminine "you" (`-كِ`). Calm, warm, premium tone.
- Numerals: Arabic-Indic in `ar`, Western in `en`. SAR currency is `ر.س` after the amount in `ar`, `SAR` before the amount in `en`.
- Status always pairs colour with an icon and a text label — never colour alone.
- No emoji in functional UI; a single 🌸/✨ in a welcome line is OK.
- No tech-blue accents; rose is the brand. No purple-blue gradients, no aggressive blurs, no black drop shadows.

## When invoked with no guidance

Ask the user what they want to build or design (one of: a mobile screen, a deck, a marketing page, a print piece, a new component variant). Then ask a few short questions about audience, scope, content, and whether they want variations — and proceed as the brand's expert designer, outputting HTML artifacts or production code based on the need.
