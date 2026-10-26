# Maker 1.3 (16) validation — 2026-10-24

Historical 2026-10-24 attempt. The simulator blocker was resolved after DevSSD migration. Current build, runtime and store evidence is recorded in [2026-10-26 validation](2026-10-26-app-store-validation.md). The blocked results below describe only the earlier attempt.

## Completed evidence

- Isolated branch from origin/main 3bfb342; original dirty checkout preserved.
- Production H5 readback confirms /learn/ exposes seven guides (including /learn/3d-printer-hourly-cost/), /projects/ advertises 42 products, and /saved/ plus /calculator/machine-finder/ are present.
- Apple Xcode 27.1 (27A9275) located on external disk.
- Initial simulator build: BUILD SUCCEEDED.
- Latest source and XCTest bundle compile/link/package validation completed using SDK iphonesimulator27.1. No Swift compiler error was emitted.
- Read-only Apple resizability audit: no main-screen, layout-orientation, device-idiom, or legacy AppDelegate replacements required. Drawer horizontal safe-area ignore and fixed 112px web bottom clearance were corrected. Existing full-bleed background/scrim layers retained.
- New unit cases cover route ownership, query/fragment preservation, external-destination rejection, and future-document language scripts. These tests are compiled but NOT counted as executed/passed.
- git diff --check passed.

## Runtime blocker

First test attempt encountered internal-disk ENOSPC. Only task-created resources were stopped/removed; other projects and simulators were preserved.

An independent APFS sparsebundle on the external HFS+ disk holds the replacement QA device, avoiding internal simulator data growth. With -jobs 1, parallel testing disabled, and compiler indexing disabled, the latest build completed. CoreSimulator then failed to start the test run: no Test Suite result appeared for more than six minutes. The test was interrupted explicitly. A subsequent direct simctl install timed out after 50 seconds before App launch. This is not evidence that App behavior or Duo layouts pass.

No real app screenshot or UI interaction was accepted. Inner/outer geometry was enumerated (2007×2853 and 1398×2034), but framebuffer dimensions alone do not prove app compatibility.

## Retained QA resources

- Derived data: /Volumes/LaCie/Maker-Parity-Duo-20261024
- Initial build log: /tmp/maker-duo-build.log
- Recovery test log: /Volumes/LaCie/Maker-Parity-Duo-20261024-test-recovery.log
- Interrupted result: /Volumes/LaCie/Maker-Parity-Duo-20261024-unit-recovery.xcresult
- Task-owned image: /Volumes/LaCie/Maker-Parity-Duo-20261024-Simulator.sparsebundle
- Mount: /Volumes/MakerDuoQA-20261024
- Dedicated QA device: 5DDB8FDD-AA64-481C-AB8E-5CAE6A8A6F27 (data is symlinked from default device set into this task-owned APFS image)

Do not reset the global simulator service while another project's simulator is active without user permission. No shared service restart was performed; the later SSD-backed default device set resolved the environment blocker.

## Remaining acceptance gate

1. Restore responsive simulator service; rerun the compiled unit suite.
2. Verify EN/ZH, native Projects/Saved/equipment/legal navigation, Back/Home, a current guide, calculator, radar archive, brand tracking, and 390px iPhone regression.
3. Verify real Duo Closed/Open/Partially Open plus both landscape directions, keyboard/safe-area behavior, and state retention during folding.
4. Capture real EN/ZH Duo JPEG screenshots at Apple specifications; place accepted assets in ios/AppStore/screenshots/iphone-duo/.
5. Mark PR ready only after runtime acceptance. App Store submission/release requires its own verified build and status.
