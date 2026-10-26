# Maker App parity and iPhone Duo

Goal: expose the current H5 features inside the native app and verify live resizing on iPhone Duo with Xcode 27.1.

Architecture: the five persistent WKWebView tabs remain the content source. Native menu routes open in the corresponding tab instead of Safari; brand links retain their existing tracking. System safe areas reserve native chrome space, including vertical system bars.

## Confirmed differences from H5

- Equipment matching and About/Privacy/Disclaimer currently leave the app via SwiftUI Link.
- Projects and Saved are H5 routes without direct native menu entries.
- Guides, calculators, product details and radar archives already come from the live website; they do not need a second bundled content catalogue.
- Native shell injects a fixed 112px bottom clearance, regardless of tab-bar location; drawer content ignores horizontal safe areas.
- App Store Connect 1.2 has no Duo screenshots (user evidence). A screenshot slot alone does not verify device compatibility.

## Implementation and checks

1. AppShellView.swift: route native internal menu selections through a shared callback; add Projects/Saved; keep drawer controls inside safe areas and adapt title to narrow space.
2. HomeView.swift: normalize own-site destinations, preserve query/hash, maintain a return path, update document-start language for later navigations, remove duplicate web navigation clearance.
3. Info.plist: allow phone landscape; project.yml/project.pbxproj: prepare version 1.3 (16).
4. ProfitCalculatorTests.swift: verify route ownership, query preservation, back behavior and language installation.
5. Build/test in isolated worktree. Verify ordinary iPhone and Duo outer/inner/rotated/fold transition, English/Chinese, native internal links, live H5 guide availability, calculator and saved flow. Capture real screenshots at Apple sizes.
6. Record exact validation and any App Store asset/upload limitation. Do not label a local build as a public release.

Apple sources checked 2026-10-24:
- https://developer.apple.com/iphone-duo/prepare/
- https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications

Prerequisites: UILaunchScreen present; UIRequiresFullScreen absent; scene lifecycle uses WindowGroup; iPhone only. The unused iPad orientation declaration lacks upside-down portrait; no iPad support is being added.
