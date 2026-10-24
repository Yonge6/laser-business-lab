import XCTest
@testable import MakerBusinessLab

@MainActor
final class ProfitCalculatorTests: XCTestCase {
    func testContributionIncludesFeesAndLabor() {
        let result = ProfitCalculator.calculate(.init(sellingPrice: 32, materialCost: 8.2, packagingCost: 1.5, laborCost: 4, platformFeePercent: 10, monthlyOrders: 100, machinePrice: 3_000))
        XCTAssertEqual(result.contributionPerItem, 15.1, accuracy: 0.001)
        XCTAssertEqual(result.monthlyContribution, 1_510, accuracy: 0.001)
        XCTAssertEqual(result.paybackMonths ?? 0, 1.9867, accuracy: 0.001)
    }

    func testNeverReturnsNegativeContribution() {
        let result = ProfitCalculator.calculate(.init(sellingPrice: 10, materialCost: 12, packagingCost: 1, laborCost: 1, platformFeePercent: 10, monthlyOrders: 10, machinePrice: 500))
        XCTAssertEqual(result.contributionPerItem, 0)
        XCTAssertNil(result.paybackMonths)
    }

    func testWebLanguageBridgeUsesEnglishByDefaultAndSupportsChinese() {
        XCTAssertTrue(MakerSiteWebView.languageScript(for: .english).contains("const locale = 'en'"))
        XCTAssertTrue(MakerSiteWebView.languageScript(for: .chinese).contains("const locale = 'zh'"))
        XCTAssertTrue(MakerSiteWebView.languageScript(for: .english).contains("lbl-locale-change"))
    }

    func testNativeWebShellKeepsOneHeaderAndOneBottomNavigation() {
        let script = MakerSiteWebView.nativeShellScript()
        XCTAssertTrue(script.contains(".site-header { display: none !important; }"))
        XCTAssertTrue(script.contains(".mobile-bottom-nav { display: none !important; }"))
    }

    func testNativeTabsRevalidateLiveContentAndKeepAnOfflineFallback() {
        XCTAssertEqual(MakerWebViewPool.paths, ["/", "/opportunities/", "/calculator/", "/radar/", "/learn/"])
        XCTAssertEqual(MakerWebViewSession.freshCachePolicy, .reloadRevalidatingCacheData)
        XCTAssertEqual(MakerWebViewSession.offlineCachePolicy, .returnCacheDataElseLoad)
        XCTAssertEqual(MakerWebViewSession.automaticRefreshInterval, 5 * 60)
    }

    func testNativeWebNavigationRecognizesEachTabRoot() {
        XCTAssertTrue(MakerWebViewSession.isRootURL(URL(string: "https://maker.wonderelian.com/?app=ios"), for: "/"))
        XCTAssertTrue(MakerWebViewSession.isRootURL(URL(string: "https://maker.wonderelian.com/radar/?app=ios"), for: "/radar/"))
        XCTAssertFalse(MakerWebViewSession.isRootURL(URL(string: "https://maker.wonderelian.com/ideas/personalized-tumblers/?app=ios"), for: "/"))
        XCTAssertFalse(MakerWebViewSession.isRootURL(URL(string: "https://www.1laser.com/"), for: "/"))
    }

    func testSecondaryPagesHideTheTabBar() {
        XCTAssertTrue(AppNavigationPresentation.showsTabBar(canGoBack: false))
        XCTAssertFalse(AppNavigationPresentation.showsTabBar(canGoBack: true))
    }

    func testDrawerWidthLeavesAVisibleBackdropAndCapsOnLargeScreens() {
        XCTAssertEqual(DrawerLayout.width(for: 390), 343.2, accuracy: 0.001)
        XCTAssertEqual(DrawerLayout.width(for: 1_024), 410)
    }

    func testDrawerDismissThresholdRejectsAccidentalMovement() {
        XCTAssertFalse(DrawerLayout.shouldDismiss(translation: 40, predictedTranslation: 90))
        XCTAssertTrue(DrawerLayout.shouldDismiss(translation: 73, predictedTranslation: 80))
        XCTAssertTrue(DrawerLayout.shouldDismiss(translation: 45, predictedTranslation: 140))
    }
    func testInternalDestinationsStayInTheirNativeTabAndKeepState() throws {
        let calculator = try XCTUnwrap(MakerSiteDestination(path: "/calculator/machine-finder/?product=planter&app=web#results"))
        XCTAssertEqual(calculator.tabIndex, 2)
        XCTAssertEqual(calculator.rootPath, "/calculator/")
        let components = try XCTUnwrap(URLComponents(url: calculator.url, resolvingAgainstBaseURL: false))
        XCTAssertEqual(components.fragment, "results")
        XCTAssertEqual(components.queryItems?.filter { $0.name == "app" }.map(\.value), ["ios"])
        XCTAssertEqual(components.queryItems?.first { $0.name == "product" }?.value, "planter")
        for path in ["/projects/", "/projects/a-project/", "/saved/", "/ideas/tumbler/"] {
            XCTAssertEqual(MakerSiteDestination(path: path)?.rootPath, "/opportunities/")
        }
        XCTAssertEqual(MakerSiteDestination(path: "/learn/how-to-price-3d-prints/")?.tabIndex, 4)
        XCTAssertEqual(MakerSiteDestination(path: "/radar/2026-10-24/")?.tabIndex, 3)
        XCTAssertEqual(MakerSiteDestination(path: "/privacy/")?.tabIndex, 0)
    }

    func testNativeRouterRejectsExternalDestinations() {
        for path in ["https://www.1laser.com/", "//example.com/", "mailto:test@example.com", "relative"] {
            XCTAssertNil(MakerSiteDestination(path: path))
        }
    }

    func testLanguagePreferenceIsInstalledForFutureDocuments() {
        let session = MakerWebViewSession(path: "/learn/")
        session.applyLanguage(.chinese)
        let scripts = session.webView.configuration.userContentController.userScripts
        XCTAssertTrue(scripts.contains { $0.source.contains("const locale = 'zh'") && $0.injectionTime == .atDocumentStart })
        XCTAssertFalse(scripts.contains { $0.source.contains("const locale = 'en'") })
        session.applyLanguage(.english)
        XCTAssertEqual(session.webView.configuration.userContentController.userScripts.count, 2)
    }

}
