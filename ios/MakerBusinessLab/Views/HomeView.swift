import SwiftUI
import WebKit

@MainActor
final class MakerWebViewPool: ObservableObject {
    static let paths = ["/", "/opportunities/", "/calculator/", "/radar/", "/learn/"]

    private let sessions: [String: MakerWebViewSession]
    private var didBeginPrewarming = false

    init() {
        sessions = Dictionary(uniqueKeysWithValues: Self.paths.map { path in
            (path, MakerWebViewSession(path: path))
        })
    }

    func session(for path: String) -> MakerWebViewSession {
        sessions[path] ?? sessions["/"]!
    }

    func beginPrewarming(language: AppState.Language) {
        guard !didBeginPrewarming else { return }
        didBeginPrewarming = true

        session(for: "/").loadIfNeeded(language: language)
        Task { @MainActor [weak self] in
            guard let self else { return }
            for path in Self.paths.dropFirst() {
                try? await Task.sleep(for: .milliseconds(220))
                self.session(for: path).loadIfNeeded(language: language)
            }
        }
    }

    func applyLanguage(_ language: AppState.Language) {
        sessions.values.forEach { $0.applyLanguage(language) }
    }

    func activate(tab index: Int, language: AppState.Language, forceRefresh: Bool = false) {
        let path = Self.paths.indices.contains(index) ? Self.paths[index] : "/"
        let session = session(for: path)
        session.loadIfNeeded(language: language)
        session.refreshIfStale(force: forceRefresh)
    }
}

@MainActor
final class MakerWebViewSession: NSObject, ObservableObject, WKNavigationDelegate, WKUIDelegate {
    static let automaticRefreshInterval: TimeInterval = 5 * 60
    static let freshCachePolicy: URLRequest.CachePolicy = .reloadRevalidatingCacheData
    static let offlineCachePolicy: URLRequest.CachePolicy = .returnCacheDataElseLoad

    let path: String
    let webView: WKWebView

    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published private(set) var hasRenderedContent = false
    @Published private(set) var canGoBack = false
    @Published private(set) var lastSuccessfulRefresh: Date?

    private var didStartInitialLoad = false
    private var didAttemptOfflineFallback = false
    private var currentLanguage: AppState.Language = .english

    init(path: String) {
        self.path = path

        let contentController = WKUserContentController()
        contentController.addUserScript(WKUserScript(
            source: MakerSiteWebView.languageScript(for: .english),
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        ))
        contentController.addUserScript(WKUserScript(
            source: MakerSiteWebView.nativeShellScript(),
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: true
        ))

        let configuration = WKWebViewConfiguration()
        configuration.userContentController = contentController
        configuration.websiteDataStore = .default()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true

        webView = WKWebView(frame: .zero, configuration: configuration)
        super.init()

        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.keyboardDismissMode = .interactive
        webView.scrollView.contentInsetAdjustmentBehavior = .automatic
        webView.isOpaque = false
        webView.backgroundColor = UIColor(Brand.cream)
        webView.scrollView.backgroundColor = UIColor(Brand.cream)

        let refreshControl = UIRefreshControl()
        refreshControl.tintColor = UIColor(Brand.red)
        refreshControl.addTarget(self, action: #selector(handlePullToRefresh), for: .valueChanged)
        webView.scrollView.refreshControl = refreshControl
    }

    func loadIfNeeded(language: AppState.Language) {
        currentLanguage = language
        guard !didStartInitialLoad else {
            applyLanguage(language)
            return
        }
        didStartInitialLoad = true
        isLoading = true

        let rules = #"""
        [
          {"trigger":{"url-filter":".*googletagmanager\\.com.*"},"action":{"type":"block"}},
          {"trigger":{"url-filter":".*google-analytics\\.com.*"},"action":{"type":"block"}}
        ]
        """#

        WKContentRuleListStore.default().compileContentRuleList(
            forIdentifier: "MakerBusinessLabNativePrivacy",
            encodedContentRuleList: rules
        ) { [weak self] ruleList, _ in
            Task { @MainActor in
                guard let self else { return }
                if let ruleList {
                    self.webView.configuration.userContentController.add(ruleList)
                }
                self.loadPage(cachePolicy: Self.freshCachePolicy)
            }
        }
    }

    func reload() {
        refresh(userInitiated: true)
    }

    func refreshIfStale(force: Bool = false) {
        guard didStartInitialLoad else { return }
        guard !isLoading else { return }

        let isStale = lastSuccessfulRefresh.map {
            Date().timeIntervalSince($0) >= Self.automaticRefreshInterval
        } ?? true
        guard force || isStale else { return }
        refresh(userInitiated: false)
    }

    private func refresh(userInitiated: Bool) {
        errorMessage = nil
        isLoading = true
        if webView.url == nil {
            didStartInitialLoad = false
            loadIfNeeded(language: currentLanguage)
        } else {
            if userInitiated {
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
            }
            webView.reloadFromOrigin()
        }
    }

    @objc private func handlePullToRefresh() {
        refresh(userInitiated: true)
    }

    func goBack() {
        guard webView.canGoBack else {
            returnToRoot(language: currentLanguage)
            return
        }
        webView.goBack()
    }

    func returnToRoot(language: AppState.Language) {
        currentLanguage = language

        if Self.isRootURL(webView.url, for: path) {
            webView.scrollView.setContentOffset(.zero, animated: true)
            refreshNavigationState()
            return
        }

        if let rootItem = webView.backForwardList.backList.last(where: {
            Self.isRootURL($0.url, for: path)
        }) {
            webView.go(to: rootItem)
        } else {
            loadPage(cachePolicy: Self.freshCachePolicy)
        }
    }

    static func isRootURL(_ url: URL?, for path: String) -> Bool {
        guard let url, url.host == "maker.wonderelian.com" else { return false }
        let normalizedPath = path == "/" ? "/" : path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        let currentPath = url.path == "/" ? "/" : url.path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        return currentPath == normalizedPath
    }

    func applyLanguage(_ language: AppState.Language) {
        currentLanguage = language
        guard didStartInitialLoad else { return }
        webView.evaluateJavaScript(MakerSiteWebView.languageScript(for: language))
    }

    private func loadPage(cachePolicy: URLRequest.CachePolicy) {
        var components = URLComponents(string: "https://maker.wonderelian.com")!
        components.path = path
        components.queryItems = [URLQueryItem(name: "app", value: "ios")]
        guard let url = components.url else { return }

        var request = URLRequest(url: url)
        request.cachePolicy = cachePolicy
        request.timeoutInterval = 30
        webView.load(request)
    }

    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        errorMessage = nil
        isLoading = true
    }

    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        refreshNavigationState()
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        isLoading = false
        hasRenderedContent = true
        lastSuccessfulRefresh = Date()
        didAttemptOfflineFallback = false
        errorMessage = nil
        webView.scrollView.refreshControl?.endRefreshing()
        webView.evaluateJavaScript(MakerSiteWebView.nativeShellScript())
        applyLanguage(currentLanguage)
        refreshNavigationState()
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        show(error)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        show(error)
    }

    private func show(_ error: Error) {
        let code = (error as NSError).code
        guard code != NSURLErrorCancelled else { return }

        isLoading = false
        webView.scrollView.refreshControl?.endRefreshing()

        if !hasRenderedContent && !didAttemptOfflineFallback {
            didAttemptOfflineFallback = true
            loadPage(cachePolicy: Self.offlineCachePolicy)
            return
        }

        errorMessage = error.localizedDescription
        refreshNavigationState()
    }

    private func refreshNavigationState() {
        canGoBack = webView.canGoBack && !Self.isRootURL(webView.url, for: path)
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping @MainActor @Sendable (WKNavigationActionPolicy) -> Void
    ) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.cancel)
            return
        }

        if let scheme = url.scheme, !["http", "https"].contains(scheme) {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }

        if let host = url.host, host != "maker.wonderelian.com" {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }

        decisionHandler(.allow)
    }

    func webView(
        _ webView: WKWebView,
        createWebViewWith configuration: WKWebViewConfiguration,
        for navigationAction: WKNavigationAction,
        windowFeatures: WKWindowFeatures
    ) -> WKWebView? {
        guard let url = navigationAction.request.url else { return nil }
        if url.host == "maker.wonderelian.com" {
            webView.load(URLRequest(url: url, cachePolicy: Self.freshCachePolicy))
        } else {
            UIApplication.shared.open(url)
        }
        return nil
    }
}

struct SiteTabView: View {
    @EnvironmentObject private var appState: AppState
    @ObservedObject var session: MakerWebViewSession
    let onHome: () -> Void

    var body: some View {
        ZStack {
            MakerSiteWebView(session: session)

            if session.isLoading && !session.hasRenderedContent {
                VStack(spacing: 12) {
                    ProgressView()
                        .tint(Brand.red)
                    Text(appState.text("Loading Maker Business Lab…", "正在加载 Maker Business Lab…"))
                        .font(.footnote.bold())
                        .foregroundStyle(Brand.muted)
                }
                .padding(18)
                .background(.ultraThinMaterial)
                .overlay(Rectangle().stroke(Brand.ink.opacity(0.18)))
            }


            if session.isLoading && session.hasRenderedContent {
                VStack(spacing: 0) {
                    ProgressView()
                        .progressViewStyle(.linear)
                        .tint(Brand.red)
                    Spacer()
                }
                .allowsHitTesting(false)
                .accessibilityHidden(true)
            }

            if let errorMessage = session.errorMessage {
                if session.hasRenderedContent {
                    VStack {
                        Spacer()
                        HStack(spacing: 10) {
                            Image(systemName: "wifi.slash")
                                .foregroundStyle(Brand.red)
                            Text(appState.text(
                                "Showing saved content. Pull down to retry.",
                                "当前显示已保存内容，下拉可重试。"
                            ))
                            .font(.footnote.weight(.semibold))
                            .frame(maxWidth: .infinity, alignment: .leading)
                            Button(action: session.reload) {
                                Image(systemName: "arrow.clockwise")
                                    .font(.body.bold())
                                    .foregroundStyle(Brand.ink)
                                    .frame(width: 36, height: 36)
                            }
                            .accessibilityLabel(appState.text("Retry", "重试"))
                        }
                        .padding(.leading, 14)
                        .padding(.trailing, 8)
                        .padding(.vertical, 8)
                        .background(.ultraThinMaterial)
                        .overlay(Rectangle().stroke(Brand.ink.opacity(0.25)))
                        .padding(.horizontal, 12)
                        .padding(.bottom, 8)
                    }
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                } else {
                    VStack(alignment: .leading, spacing: 12) {
                        SectionEyebrow(text: appState.text("Connection interrupted", "连接中断"))
                        Text(appState.text("This page could not load.", "此页面暂时无法加载。"))
                            .font(.title3)
                            .fontWeight(.black)
                        Text(errorMessage)
                            .font(.footnote)
                            .foregroundStyle(Brand.muted)
                            .lineLimit(2)
                        Button(action: session.reload) {
                            PrimaryButtonLabel(title: appState.text("Try again", "重新加载"), icon: "arrow.clockwise")
                        }
                        .buttonStyle(.plain)
                    }
                    .padding(20)
                    .background(Brand.cream)
                    .overlay(Rectangle().stroke(Brand.ink, lineWidth: 1.5))
                    .padding(20)
                }
            }
        }
        .background(Brand.cream.ignoresSafeArea())
        .makerAppHeader(
            canGoBack: session.canGoBack,
            onBack: session.goBack,
            onHome: onHome
        )
        .toolbar(
            AppNavigationPresentation.showsTabBar(canGoBack: session.canGoBack) ? .visible : .hidden,
            for: .tabBar
        )
        .toolbar(.hidden, for: .navigationBar)
        .onAppear {
            session.loadIfNeeded(language: appState.language)
            session.refreshIfStale()
        }
    }
}

struct MakerSiteWebView: UIViewRepresentable {
    let session: MakerWebViewSession

    func makeUIView(context: Context) -> WKWebView {
        session.webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    static func nativeShellScript() -> String {
        #"""
    (() => {
      const nativeCSS = `
        .site-header { display: none !important; }
        .mobile-bottom-nav { display: none !important; }
        body { padding-bottom: 112px !important; }
        html { scroll-padding-bottom: 112px !important; }
      `;
      const installNativeStyles = () => {
        let style = document.getElementById('maker-native-ios-shell');
        if (!style) {
          style = document.createElement('style');
          style.id = 'maker-native-ios-shell';
          document.documentElement.appendChild(style);
        }
        if (style.textContent !== nativeCSS) style.textContent = nativeCSS;
        document.documentElement.dataset.nativeIosApp = 'true';
      };
      installNativeStyles();
      new MutationObserver(installNativeStyles).observe(document.documentElement, { childList: true, subtree: true });
    })();
    """#
    }

    static func languageScript(for language: AppState.Language) -> String {
        let locale = language == .chinese ? "zh" : "en"
        return #"""
        (() => {
          const locale = '\#(locale)';
          const key = 'lbl_locale';
          if (window.sessionStorage.getItem(key) !== locale) {
            window.sessionStorage.setItem(key, locale);
            document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
            window.dispatchEvent(new Event('lbl-locale-change'));
          }
        })();
        """#
    }
}

struct MetricChip: View {
    let label: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label.uppercased())
                .font(.caption2.bold())
                .foregroundStyle(.secondary)
            Text(value)
                .font(.system(.headline, design: .rounded, weight: .black))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(10)
        .background(Brand.cream)
    }
}
