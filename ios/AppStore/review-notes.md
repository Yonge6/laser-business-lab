# App Review Notes

Maker Business Lab is a bilingual SwiftUI app with native navigation around first-party content from `maker.wonderelian.com`. This keeps opportunity data and editorial guides current without an App Store release for each content update. It requires no account and contains no advertising, user-generated content, external payment, or in-app purchase. It does not claim guaranteed income.

Review path:

1. Home shows ranked product opportunities and direct paths into validation and profit tools.
2. Opportunities opens product details, planning assumptions, and optional external equipment links.
3. Calculate updates contribution margin and payback from user-entered assumptions in the app's first-party web content.
4. Radar shows the weekly product focus and current daily validation task.
5. Learn opens complete English and Chinese U.S.-focused business guides.
6. Open the native menu for Project Library, Saved opportunities, Equipment Finder, About, Privacy, and Disclaimer. These first-party destinations remain inside the app. Use native Back to return, and Home to restore the selected section root.

Version 1.3 uses the iOS 27.1 SDK and supports resizing across iPhone Duo inner and outer displays, portrait, landscape, and fold transitions. Language selection persists when navigating to later pages. Bookmarks stay in the device's local website data store; no cross-device account synchronization is claimed.

The app revalidates first-party content at launch, when the selected tab becomes active, and when returning from the background. Pull-to-refresh forces an origin reload. If a refresh fails after content has loaded, the app keeps the last visible page and presents a small retry banner instead of replacing it with an error screen.

Anonymous usage analytics is off by default. A user can enable or disable it from the App menu. When enabled, first-party product events are labeled as iOS App activity and processed through the website's GA4 connection. Calculator inputs, calculated amounts, free text, email addresses, and other personal content are excluded.

External equipment links are optional and open only after the user taps them. Attributed links include `utm_source=elian`. Prices, costs, scores, margins, and payback periods are labeled as planning estimates and not guaranteed earnings.
