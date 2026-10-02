# Prompt: Preserve Button Text Color With Custom Typography

## Goal

Fix `cn()` class merging so custom typography utilities such as `text-caption` and `text-body-sm` are recognized as font-size classes by `tailwind-merge`. This currently causes the Subscribe button's `text-white` color class to be removed when merged with `text-caption`.

## Skills read

- `AGENTS.md` — workflow and prompt approval requirements, minimal UI scope, TypeScript/code standards, and required checks.
- No feature skill applies; this is a local Tailwind utility-merging issue.

## Existing code inspected

- `lib/utils.ts` — `cn()` combines `clsx` and `twMerge`.
- `components/ui/button.tsx` — the primary variant already supplies `text-white`.
- `components/layout/site-header.tsx` — Subscribe supplies `text-caption` after the variant classes.
- `app/globals.css` — `@theme inline` defines `--text-h1`, `--text-h2`, `--text-h3`, `--text-h4`, `--text-body-lg`, `--text-body-md`, `--text-body-sm`, and `--text-caption` as typography sizes.
- Installed `tailwind-merge` reproduction — `text-white` is dropped when followed by `text-caption`; when order is reversed, the caption size is dropped.

## Decisions / assumptions

- Keep the current button variants and the Subscribe button's typography/color classes unchanged.
- Fix the root cause centrally in `cn()` by extending `tailwind-merge`'s font-size class group for the custom typography token names from `app/globals.css`.
- Do not alter Tailwind CSS tokens, button styles, or unrelated component class names.
- No new dependency or test framework is needed.

## Files likely to change

- `lib/utils.ts`

## Implementation requirements

- Configure `tailwind-merge` to treat `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-body-lg`, `text-body-md`, `text-body-sm`, and `text-caption` as font-size utilities.
- Preserve normal conflict resolution when two font-size utilities are supplied, including responsive modifiers.
- Do not classify color utilities such as `text-white`, `text-text-primary`, or `text-text-secondary` as font sizes.

## Security requirements

- This is a client-safe styling utility only. Do not add secrets, server-only dependencies, network calls, or browser-visible configuration.

## Acceptance criteria

- Merging the primary button classes with `text-caption` retains both `text-white` and `text-caption`.
- The responsive `sm:text-body-sm` remains alongside the base `text-caption`.
- When two font-size utilities conflict at the same responsive scope, the later one wins as before.
- Existing button variants and other class merging continue to work.

## Checks to run

- Run a focused `tailwind-merge` assertion or equivalent against the exact Subscribe class combination and a font-size conflict.
- `npm run typecheck`
- `npm run lint`

## Manual test steps

1. Run `npm run dev`.
2. Open `http://localhost:3000/` and inspect the Subscribe button's class list: it should contain `text-white`, `text-caption`, and `sm:text-body-sm`.
3. Confirm Subscribe text is white on its dark background at mobile and desktop widths.
4. Confirm Login and the button variants on `/design-system` retain their expected colors and typography.
