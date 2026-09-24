# App Review Notes

Maker Business Lab is a bilingual SwiftUI app with native navigation around first-party content from `maker.wonderelian.com`. This keeps opportunity data and editorial guides current without an App Store release for each content update. It requires no account and contains no advertising, user-generated content, external payment, or in-app purchase. It does not claim guaranteed income.

Review path:

1. Home shows ranked product opportunities and direct paths into validation and profit tools.
2. Opportunities opens product details, planning assumptions, and optional external equipment links.
3. Calculate updates contribution margin and payback from user-entered assumptions in the app's first-party web content.
4. Radar shows the weekly product focus and current daily validation task.
5. Learn opens bilingual U.S.-focused business guides.

The app revalidates first-party content at launch, when the selected tab becomes active, and when returning from the background. Pull-to-refresh forces an origin reload. If a refresh fails after content has loaded, the app keeps the last visible page and presents a small retry banner instead of replacing it with an error screen.

External equipment links are optional and open only after the user taps them. Attributed links include `utm_source=elian`. Prices, costs, scores, margins, and payback periods are labeled as planning estimates and not guaranteed earnings.
