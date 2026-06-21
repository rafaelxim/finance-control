# Fonts

The app intentionally uses available open font stacks instead of Binance's
custom licensed typefaces:

- `Inter` for UI text, headings, navigation, and buttons
- `JetBrains Mono` for monetary values, percentages, and financial numbers

No font binaries are required in this directory. If you later decide to bundle
font files, add the `@font-face` declarations in `src/app/styles/main.css` and
keep the same `--font-body` / `--font-number` tokens.
