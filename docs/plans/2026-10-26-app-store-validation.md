# Maker 1.3 (16) validation — 2026-10-26

## Build and source

- Worktree: `codex/maker-app-parity-duo`; merged current main b4345fd, including the 2026-10-26 Radar. Original dirty checkout preserved.
- DevSSD UUID `4782005C-E75C-406A-A195-A4A2AA8369C5` verified mounted before writes. Default CoreSimulator device directory is mounted from the SSD-backed image. No global simulator reset or other-project device operation.
- Xcode 27.1 (27A9275), iPhoneOS 27.1 SDK, minimum iOS 17, arm64. iPhone portrait plus both landscape directions.
- Unit tests: **12 executed, 0 failures**, including in-app routing, query/fragment preservation, external URL rejection and language scripts. `unit.log` and `unit.xcresult` in the report directory.
- Signed Release archive: `MakerBusinessLab-1.3-16.xcarchive`; exact bundle `com.wonderelian.makerbusinesslab`, team `L855ZVM679`, version 1.3 build 16. Strict codesign verification passed.
- Automatic App Store export/upload: **EXPORT SUCCEEDED**. Apple build `84dfe2e0-f8f4-4479-9d9c-d5ff96602c2a` processed **VALID**, attached to version 1.3. Apple's processed build reports Duo support. Upload is distinct from review submission.

## Runtime acceptance

Dedicated Maker Duo `A39E7997-4504-457C-9CC8-8AFA87C20064` (27.1) and Maker iPhone 17 Pro `35C4EAB2-8FA9-4DAD-9AA9-06C102B42B7F` (26.5) use the current branch's binary.

- Real EN/ZH capture of Home, Opportunities, Calculator, current Radar and Learn on Duo inner portrait (2007×2853).
- Outer Home EN/ZH (1398×2034), inner landscape (2853×2007), opposite landscape and Partially Open captured.
- Project library retained its page and Chinese language through Open → Closed.
- The first outer Chinese screenshot was captured before page hydration; it was rejected and replaced. It is not acceptance evidence.
- Projects, Saved, equipment matching, About, Privacy and Disclaimer were opened inside the app with working native Back; no Safari handoff for these first-party routes. Keyboard and new-document guide checks also passed: Duo outer ROI selling-price field focused with a visible number pad; input changed 35 → 350 and Done dismissed the keyboard without obscuring the header. The latest 3D-printer hourly-cost guide opened from Chinese Learn with Chinese title/body, source date 2026-10-23, and native Back. Dedicated QA simulator input changes are test state only.

## Store assets and metadata

36 code-composed RGB PNGs: 10 medium iPhone, 10 large iPhone, 12 Duo (inner five pages plus outer Home in each language), and 4 localized header/search creatives. Posters embed complete actual simulator captures without stretching or fabricated UI. Large-phone canvases contain the actual 17 Pro capture with preserved aspect ratio. All source screenshot hashes and frame dimensions are in the asset manifest.

- English and Simplified Chinese names, subtitles, keywords, promotional text, description and release notes saved/read back from version 1.3. Name remains Maker Business Lab.
- Subtitle: `Product Ideas, Costs & Pricing`; Chinese `产品机会、利润测算与设备选择`.
- Keyword limits validated in UTF-8 bytes: EN 88, ZH 84. No third-party company names in keywords.
- Header 5244×2950; search 3840×2560. All files match Apple catalog image specifications and are RGB without alpha.
- All 36 assets processed successfully: 18 ACTIVE placements per localization (5 medium + 5 large + 6 Duo + header + search). Exact file sizes match the final repo assets, and source capture SHA-256 values match the provenance manifest.
- Both localizations receive explicit assets rather than relying on English fallbacks. Previous 1.2 large-phone screenshot placements were replaced only in editable version 1.3; approved library originals stay intact.
- Apple product-page and search previews checked in EN/ZH. Header artwork uses the central safe zone of the 5244×2950 universal format so the title survives phone cropping. Rejected task-created draft assets were removed only after verifying they had no placements.
- All runtime and asset gates passed before submission. Release mode remains MANUAL, as inherited from version 1.2.

## Evidence paths

- `/Volumes/DevSSD/Build/Reports/Maker/release-20261026/`
- `/Volumes/DevSSD/Build/Archives/MakerBusinessLab-1.3-16.xcarchive`
- `ios/AppStore/screenshots/release-1.3/manifest.json`

## Final completion

All acceptance gates passed. Submitted at **2026-10-26 17:57 Asia/Shanghai**. App Store version and review submission both read back **WAITING_FOR_REVIEW**. Review submission `d3addb60-37f8-4920-9a10-5d78b4142e42` contains iOS App 1.3 (16). Apple processing is VALID and Duo support is recognized.

There is no public 1.3 release yet; 1.2 remains the distributable version. Release mode is MANUAL. The current state is a successful submission, not Apple approval.

Sanitized verification: `ios/AppStore/release-1.3-verification.json`. Raw browser submission readback: `submission-readback.json` in the DevSSD report directory. The original dirty checkout remains untouched. Dedicated Maker QA devices and MCP sessions are stopped after acceptance; no shared simulator reset is required.
