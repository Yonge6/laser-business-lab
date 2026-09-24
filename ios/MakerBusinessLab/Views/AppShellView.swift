import SwiftUI

struct AppShellView: View {
    @Environment(\.scenePhase) private var scenePhase
    @EnvironmentObject private var appState: AppState
    @StateObject private var webViewPool = MakerWebViewPool()

    var body: some View {
        ZStack {
            TabView(selection: $appState.selectedTab) {
                NavigationStack { SiteTabView(session: webViewPool.session(for: "/"), onHome: returnHome) }
                    .tabItem { Label(appState.text("Home", "首页"), systemImage: "house.fill") }
                    .tag(0)
                NavigationStack { SiteTabView(session: webViewPool.session(for: "/opportunities/"), onHome: returnHome) }
                    .tabItem { Label(appState.text("Ideas", "机会"), systemImage: "magnifyingglass") }
                    .tag(1)
                NavigationStack { SiteTabView(session: webViewPool.session(for: "/calculator/"), onHome: returnHome) }
                    .tabItem { Label(appState.text("Profit", "测算"), systemImage: "plus.forwardslash.minus") }
                    .tag(2)
                NavigationStack { SiteTabView(session: webViewPool.session(for: "/radar/"), onHome: returnHome) }
                    .tabItem { Label(appState.text("Radar", "雷达"), systemImage: "scope") }
                    .tag(3)
                NavigationStack { SiteTabView(session: webViewPool.session(for: "/learn/"), onHome: returnHome) }
                    .tabItem { Label(appState.text("Learn", "学习"), systemImage: "book.fill") }
                    .tag(4)
            }
            .toolbarBackground(Brand.cream, for: .tabBar)
            .toolbarBackground(.visible, for: .tabBar)
            .toolbarColorScheme(.light, for: .tabBar)

            if appState.isDrawerOpen {
                NativeDrawerOverlay()
                    .transition(.opacity)
                    .zIndex(100)
            }
        }
        .background(Brand.cream.ignoresSafeArea())
        .animation(.easeOut(duration: 0.22), value: appState.isDrawerOpen)
        .task {
            webViewPool.beginPrewarming(language: appState.language)
        }
        .onChange(of: appState.language) { _, language in
            webViewPool.applyLanguage(language)
        }
        .onChange(of: appState.selectedTab) { _, tab in
            webViewPool.activate(tab: tab, language: appState.language)
        }
        .onChange(of: scenePhase) { _, phase in
            guard phase == .active else { return }
            webViewPool.activate(tab: appState.selectedTab, language: appState.language)
        }
        .sensoryFeedback(.selection, trigger: appState.selectedTab)
        .sensoryFeedback(.selection, trigger: appState.language)
    }

    private func returnHome() {
        appState.selectedTab = 0
        webViewPool.session(for: "/").returnToRoot(language: appState.language)
    }
}

struct BrandHeader: View {
    @EnvironmentObject private var appState: AppState
    var canGoBack = false
    var onBack: () -> Void = {}
    var onHome: () -> Void = {}

    var body: some View {
        HStack(spacing: 8) {
            leadingControl
            Button(action: onHome) {
                brandTitle
            }
            .buttonStyle(.plain)
            .accessibilityLabel(appState.text("Return to Home", "返回首页"))
            Spacer(minLength: 4)
            HStack(spacing: 0) {
                languageButton("EN", language: .english)
                languageButton("中", language: .chinese)
            }
            .overlay(Rectangle().stroke(Brand.ink, lineWidth: 1))

            Button {
                appState.isDrawerOpen = true
            } label: {
                Image(systemName: "line.3.horizontal")
                    .font(.system(size: 19, weight: .black))
                    .foregroundStyle(.white)
                    .frame(width: 42, height: 42)
                    .background(Brand.ink)
            }
            .buttonStyle(.plain)
            .accessibilityLabel(appState.text("Open menu", "打开菜单"))
        }
        .padding(.horizontal, 12)
        .frame(minHeight: 60)
        .background(.ultraThinMaterial)
        .overlay(alignment: .bottom) { Divider() }
    }

    @ViewBuilder
    private var leadingControl: some View {
        if canGoBack {
            Button(action: onBack) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 18, weight: .black))
                    .foregroundStyle(.white)
                    .frame(width: 38, height: 38)
                    .background(Brand.ink)
                    .clipShape(RoundedRectangle(cornerRadius: 9))
            }
            .buttonStyle(.plain)
            .accessibilityLabel(appState.text("Back", "返回"))
        } else {
            Button(action: onHome) {
                Image("MakerMark")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 38, height: 38)
                    .clipShape(RoundedRectangle(cornerRadius: 9))
            }
            .buttonStyle(.plain)
            .accessibilityLabel(appState.text("Home", "首页"))
        }
    }

    @ViewBuilder
    private var brandTitle: some View {
        let title = Text("MAKER BUSINESS LAB")
            .font(.system(size: 18, weight: .black))
            .fontWidth(.condensed)
            .tracking(-0.3)
            .minimumScaleFactor(0.72)
            .lineLimit(1)

        if appState.language == .english {
            title.italic()
        } else {
            title
        }
    }

    private func languageButton(_ title: String, language: AppState.Language) -> some View {
        Button {
            appState.language = language
        } label: {
            Text(title)
                .font(.system(.subheadline, weight: .black))
                .foregroundStyle(appState.language == language ? .white : Brand.ink)
                .frame(width: 36, height: 40)
                .background(appState.language == language ? Brand.red : Brand.cream)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(language == .english ? "Switch to English" : "切换为中文")
    }
}

enum AppNavigationPresentation {
    static func showsTabBar(canGoBack: Bool) -> Bool {
        !canGoBack
    }
}

enum DrawerLayout {
    static func width(for containerWidth: CGFloat) -> CGFloat {
        min(containerWidth * 0.88, 410)
    }

    static func shouldDismiss(translation: CGFloat, predictedTranslation: CGFloat) -> Bool {
        translation >= 72 || predictedTranslation >= 120
    }
}

struct NativeDrawerOverlay: View {
    @EnvironmentObject private var appState: AppState
    @GestureState private var dragOffset: CGFloat = 0

    var body: some View {
        GeometryReader { proxy in
            let width = DrawerLayout.width(for: proxy.size.width)
            let progress = min(max(dragOffset / width, 0), 1)

            ZStack(alignment: .trailing) {
                Color.black.opacity(0.56 * (1 - progress))
                    .ignoresSafeArea()
                    .contentShape(Rectangle())
                    .onTapGesture(perform: close)
                    .accessibilityLabel(appState.text("Close menu", "关闭菜单"))
                    .accessibilityAddTraits(.isButton)

                NativeSiteDrawer()
                    .frame(width: width)
                    .background(Brand.cream)
                    .clipShape(.rect(topLeadingRadius: 16, bottomLeadingRadius: 16))
                    .shadow(color: .black.opacity(0.32), radius: 28, x: -10)
                    .offset(x: max(0, dragOffset))
                    .gesture(
                        DragGesture(minimumDistance: 8, coordinateSpace: .local)
                            .updating($dragOffset) { value, state, _ in
                                guard value.translation.width > 0,
                                      abs(value.translation.width) > abs(value.translation.height) else { return }
                                state = value.translation.width
                            }
                            .onEnded { value in
                                if DrawerLayout.shouldDismiss(
                                    translation: value.translation.width,
                                    predictedTranslation: value.predictedEndTranslation.width
                                ) {
                                    close()
                                }
                            }
                    )
                    .transition(.move(edge: .trailing))
                    .accessibilityAction(.escape) {
                        close()
                    }
            }
        }
        .ignoresSafeArea(edges: .horizontal)
    }

    private func close() {
        appState.isDrawerOpen = false
    }
}

extension View {
    func makerAppHeader(
        canGoBack: Bool = false,
        onBack: @escaping () -> Void = {},
        onHome: @escaping () -> Void = {}
    ) -> some View {
        safeAreaInset(edge: .top, spacing: 0) {
            BrandHeader(canGoBack: canGoBack, onBack: onBack, onHome: onHome)
        }
    }
}

struct NativeSiteDrawer: View {
    @EnvironmentObject private var appState: AppState

    private let works = [
        DrawerLink(title: "WonderElian", titleZh: "WonderElian", subtitle: "Make complex ideas clear, beautiful, and human", subtitleZh: "让复杂的想法变得清晰、好看而有人情味", url: "https://wonderelian.com/"),
        DrawerLink(title: "Yixiu Meditation", titleZh: "一休冥想", subtitle: "Return to the present through sound", subtitleZh: "让声音带你回到当下", url: "https://yixiu.wonderelian.com/"),
        DrawerLink(title: "Xiazi Says", titleZh: "虾子曰", subtitle: "See yesterday's world through nine global stories", subtitleZh: "用 9 个全球热点看清昨日世界", url: "https://xiazishuo.com/"),
        DrawerLink(title: "Bu'er · Know Yourself", titleZh: "不二 · 认识自己", subtitle: "A bilingual manual for your life", subtitleZh: "一份中英双语的人生使用说明书", url: "https://human-design.wonderelian.com/"),
        DrawerLink(title: "Style Atlas", titleZh: "艺术风格图鉴", subtitle: "Learn to see a style", subtitleZh: "沿着艺术与设计脉络看懂一种美", url: "https://style-atlas.wonderelian.com/"),
        DrawerLink(title: "Wendao · Daodejing", titleZh: "三慢问道", subtitle: "Read the classic slowly—and yourself with it", subtitleZh: "慢读《道德经》，也慢慢认识自己", url: "https://wendao.wonderelian.com/")
    ]

    private let contacts = [
        DrawerLink(title: "WonderElian", titleZh: "WonderElian", url: "https://wonderelian.com/"),
        DrawerLink(title: "Email", titleZh: "邮箱", url: "mailto:hustyy986@gmail.com"),
        DrawerLink(title: "RED", titleZh: "小红书", url: "https://xhslink.cn/m/3OF5qu7Peui"),
        DrawerLink(title: "Douyin", titleZh: "抖音", url: "https://v.douyin.com/d9L1thkye0Y/"),
        DrawerLink(title: "X", titleZh: "X", url: "https://x.com/yongyuan1?s=11"),
        DrawerLink(title: "TikTok", titleZh: "TikTok", url: "https://www.tiktok.com/@wonderelian?_r=1&_t=ZP-98Tvaldfrpe")
    ]

    var body: some View {
        VStack(spacing: 0) {
            drawerHeader
            ScrollView {
                VStack(spacing: 0) {
                    mission
                    primaryNavigation
                    relatedWorks
                    contactAndLegal
                }
            }
            languageFooter
        }
        .background(Brand.cream.ignoresSafeArea())
        .preferredColorScheme(.light)
    }

    private var drawerHeader: some View {
        HStack(alignment: .center, spacing: 16) {
            VStack(alignment: .leading, spacing: 5) {
                Text("MAKER BUSINESS LAB / CONTROL DECK")
                    .font(.caption2.bold())
                    .tracking(1)
                    .foregroundStyle(Brand.red)
                Text(appState.text("YOUR MAKER BASE", "你的 MAKER 基地"))
                    .font(.system(size: 30, weight: .black))
            }
            Spacer()
            Button { appState.isDrawerOpen = false } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 18, weight: .black))
                    .frame(width: 46, height: 46)
                    .foregroundStyle(.white)
                    .overlay(Rectangle().stroke(.gray))
            }
            .buttonStyle(.plain)
            .accessibilityLabel(appState.text("Close menu", "关闭菜单"))
        }
        .padding(.horizontal, 22)
        .padding(.vertical, 18)
        .foregroundStyle(.white)
        .background(Brand.ink)
        .overlay(alignment: .leading) { Rectangle().fill(Brand.red).frame(width: 7) }
    }

    private var mission: some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionEyebrow(text: "01 / " + appState.text("Continue the quest", "继续任务"))
            Text(appState.text("START WITH A PRODUCT PEOPLE WILL BUY.", "从一个能卖的产品开始。"))
                .font(.system(size: 34, weight: .black))
            Text(appState.text(
                "Find the opportunity, validate the economics, then choose how to make it. Every step returns to business numbers.",
                "先找到机会，再验证利润和生产方式；每一步都回到商业数字。"
            ))
            .foregroundStyle(Brand.muted)
            Button {
                selectTab(1)
            } label: {
                PrimaryButtonLabel(title: appState.text("Start opportunity quest", "开始机会任务"), icon: "arrow.right")
            }
            .buttonStyle(.plain)
        }
        .padding(24)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.white)
        .overlay(alignment: .bottom) { Divider() }
    }

    private var primaryNavigation: some View {
        VStack(spacing: 0) {
            nativeNavRow(index: "01", title: appState.text("Home", "首页"), icon: "house.fill", tab: 0)
            nativeNavRow(index: "02", title: appState.text("Find an opportunity", "发现赚钱机会"), icon: "scope", tab: 1)
            nativeNavRow(index: "03", title: appState.text("Calculate profit", "测算利润"), icon: "plus.forwardslash.minus", tab: 2)
            externalNavRow(index: "04", title: appState.text("Match equipment", "匹配设备"), icon: "hammer.fill", url: "https://maker.wonderelian.com/calculator/machine-finder/")
            nativeNavRow(index: "05", title: appState.text("Opportunity radar", "机会雷达"), icon: "waveform.path.ecg", tab: 3)
            nativeNavRow(index: "06", title: appState.text("Maker playbook", "Maker 赚钱指南"), icon: "book.fill", tab: 4)
        }
        .overlay(Rectangle().stroke(Brand.ink, lineWidth: 1))
    }

    private var relatedWorks: some View {
        VStack(alignment: .leading, spacing: 0) {
            VStack(alignment: .leading, spacing: 7) {
                SectionEyebrow(text: "02 / " + appState.text("Works along the way", "沿途所作"))
                Text(appState.text("SEE THE WORLD, KNOW YOURSELF, AND LEARN TO SEE BEAUTY.", "观世界，识自己，也学习看见美。"))
                    .font(.title2)
                    .fontWeight(.black)
            }
            .padding(24)

            ForEach(Array(works.enumerated()), id: \.element.id) { index, item in
                externalLinkRow(index: String(format: "%02d", index + 1), item: item)
            }
        }
        .overlay(alignment: .bottom) { Divider() }
    }

    private var contactAndLegal: some View {
        VStack(alignment: .leading, spacing: 16) {
            SectionEyebrow(text: "03 / " + appState.text("Contact & info", "联系与说明"))
            Text(appState.text("STAY IN THE LOOP", "保持联系"))
                .font(.title2)
                .fontWeight(.black)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                ForEach(contacts) { item in
                    Link(destination: trackedURL(item.url)) {
                        HStack {
                            Text(appState.language == .english ? item.title : item.titleZh)
                                .font(.subheadline.bold())
                            Spacer()
                            Image(systemName: "arrow.up.right")
                        }
                        .foregroundStyle(Brand.ink)
                        .padding(12)
                        .overlay(Rectangle().stroke(Brand.ink.opacity(0.35)))
                    }
                }
            }

            HStack(spacing: 18) {
                legalLink(appState.text("About", "关于"), "https://maker.wonderelian.com/about/")
                legalLink(appState.text("Privacy", "隐私"), "https://maker.wonderelian.com/privacy/")
                legalLink(appState.text("Disclaimer", "免责声明"), "https://maker.wonderelian.com/disclaimer/")
            }
        }
        .padding(24)
    }

    private var languageFooter: some View {
        HStack {
            Text(appState.text("Interface language", "界面语言"))
                .font(.caption.bold())
            Spacer()
            Button("EN") { appState.language = .english }
                .foregroundStyle(appState.language == .english ? Brand.red : .white)
            Text("/")
            Button("中文") { appState.language = .chinese }
                .foregroundStyle(appState.language == .chinese ? Brand.red : .white)
        }
        .buttonStyle(.plain)
        .padding(.horizontal, 22)
        .frame(minHeight: 58)
        .foregroundStyle(.white)
        .background(Brand.ink)
    }

    private func nativeNavRow(index: String, title: String, icon: String, tab: Int) -> some View {
        Button { selectTab(tab) } label: {
            navRow(index: index, title: title, icon: icon, external: false)
        }
        .buttonStyle(.plain)
    }

    private func externalNavRow(index: String, title: String, icon: String, url: String) -> some View {
        Link(destination: trackedURL(url)) {
            navRow(index: index, title: title, icon: icon, external: true)
        }
    }

    private func navRow(index: String, title: String, icon: String, external: Bool) -> some View {
        HStack(spacing: 14) {
            Text(index).font(.caption.bold()).foregroundStyle(Brand.red).frame(width: 28)
            Image(systemName: icon).frame(width: 26)
            Text(title.uppercased()).font(.headline.bold())
            Spacer()
            Image(systemName: external ? "arrow.up.right" : "arrow.right")
        }
        .foregroundStyle(Brand.ink)
        .padding(.horizontal, 22)
        .frame(minHeight: 62)
        .background(.white)
        .overlay(alignment: .bottom) { Divider() }
    }

    private func externalLinkRow(index: String, item: DrawerLink) -> some View {
        Link(destination: trackedURL(item.url)) {
            HStack(spacing: 14) {
                Text(index).font(.caption.bold()).foregroundStyle(Brand.red).frame(width: 28)
                VStack(alignment: .leading, spacing: 3) {
                    Text(appState.language == .english ? item.title : item.titleZh)
                        .font(.headline.bold())
                    if let subtitle = appState.language == .english ? item.subtitle : item.subtitleZh {
                        Text(subtitle).font(.caption).foregroundStyle(Brand.muted)
                    }
                }
                Spacer()
                Image(systemName: "arrow.up.right")
            }
            .foregroundStyle(Brand.ink)
            .padding(.horizontal, 22)
            .frame(minHeight: 66)
            .overlay(alignment: .bottom) { Divider() }
        }
    }

    private func legalLink(_ title: String, _ url: String) -> some View {
        Link(title, destination: trackedURL(url))
            .font(.caption.bold())
            .foregroundStyle(Brand.ink)
    }

    private func selectTab(_ tab: Int) {
        appState.selectedTab = tab
        appState.isDrawerOpen = false
    }

    private func trackedURL(_ rawValue: String) -> URL {
        guard !rawValue.hasPrefix("mailto:"), var components = URLComponents(string: rawValue) else {
            return URL(string: rawValue)!
        }
        var items = components.queryItems ?? []
        if !items.contains(where: { $0.name == "utm_source" }) {
            items.append(URLQueryItem(name: "utm_source", value: "elian"))
        }
        components.queryItems = items
        return components.url ?? URL(string: rawValue)!
    }
}

struct DrawerLink: Identifiable {
    let title: String
    let titleZh: String
    var subtitle: String?
    var subtitleZh: String?
    let url: String

    var id: String { url }
}

struct SectionEyebrow: View {
    let text: String
    var body: some View {
        Text(text.uppercased())
            .font(.system(.caption, design: .default, weight: .black))
            .tracking(1.2)
            .foregroundStyle(Brand.red)
    }
}

struct PrimaryButtonLabel: View {
    let title: String
    let icon: String
    var body: some View {
        HStack {
            Text(title.uppercased())
                .font(.system(.headline, design: .default, weight: .black))
            Spacer()
            Image(systemName: icon)
        }
        .foregroundStyle(.white)
        .padding(.horizontal, 18)
        .frame(minHeight: 52)
        .background(Brand.red)
    }
}

extension Double {
    var usd: String { formatted(.currency(code: "USD").precision(.fractionLength(0...2))) }
}
