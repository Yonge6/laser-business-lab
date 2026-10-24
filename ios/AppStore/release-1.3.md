# Maker Business Lab 1.3 (16)

## User-facing changes

English:
- Open equipment matching, project library, saved opportunities, and information pages inside the app.
- Keep the selected language when opening another page.
- Improve Back navigation for live website pages.
- Adapt to iPhone Duo inner/outer display sizes and landscape layouts.

简体中文：
- 设备匹配、项目库、收藏机会和说明页面可在 App 内打开。
- 跳转到新页面时继续使用所选语言。
- 改善线上页面的返回操作。
- 适配 iPhone Duo 内外屏及横向布局。

## Content parity

The native app loads the production H5 content in persistent WKWebView tabs. Current guides, radar archives, project library, product pages, calculators and reports use those live pages rather than an additional bundled content copy. Five-minute revalidation, foreground/tab activation and pull-to-refresh remain available. Bookmarks belong to the app's local website data store; no cross-device account sync is claimed.

## Validation

See docs/plans/2026-10-24-app-parity-duo.md for scope and Apple references, and docs/plans/2026-10-24-app-parity-duo-validation.md for exact results. Latest source and test bundle compile/package validation completed with Xcode 27.1. Unit execution, Duo UI checks and real store screenshots remain blocked by an unresponsive simulator service. A source PR or local build is not an App Store release.
