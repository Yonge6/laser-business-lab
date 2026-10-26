# Maker 1.3 App Store posters

- `iphone/{en,zh}`: 1206×2622, actual iPhone 17 Pro UI in a poster.
- `iphone-large/{en,zh}`: 1320×2868 poster canvas, containing the same full iPhone 17 Pro capture at its original aspect ratio.
- `iphone-duo/{en,zh}`: five inner-display posters at 2007×2853, plus outer Home at 1398×2034.
- `creative/{en,zh}`: product-page header at 5244×2950 and search creative at 3840×2560.

Display order: Home → Opportunities → Calculator → Radar → Learn; Duo outer Home follows as the sixth screenshot.

All screenshots show the actual 1.3 app and first-party production content. No AI-generated app UI, stretched captures, fictional demand, income, awards or user metrics. Plain dark rounded frames are graphic containers, not a claim about physical device hardware. English and Chinese visuals are independently localized.

`manifest.json` records source screenshot SHA-256, accepted dimensions and embedded frame positions. Source captures and runtime interaction evidence are retained on DevSSD under `/Volumes/DevSSD/Build/Reports/Maker/release-20261026/raw/`.

Regenerate with Pillow and the macOS DIN Condensed / PingFang fonts:

```sh
python3 scripts/app-store/render-posters.py --raw /absolute/raw-directory --out /absolute/output-directory
```

These files are prepared assets. Apple processing, placement and App Review state are verified separately in `docs/plans/2026-10-26-app-store-validation.md`.
