import SwiftUI

@main
struct MakerBusinessLabApp: App {
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            AppShellView()
                .environmentObject(appState)
                .tint(Brand.red)
                .preferredColorScheme(.light)
        }
    }
}

final class AppState: ObservableObject {
    enum Language: String, CaseIterable, Identifiable {
        case english = "en"
        case chinese = "zh-Hans"
        var id: String { rawValue }
    }

    @Published var language: Language {
        didSet { UserDefaults.standard.set(language.rawValue, forKey: "appLanguage") }
    }
    @Published var selectedTab: Int
    @Published var isDrawerOpen: Bool
    @Published private(set) var savedIDs: Set<String>

    init() {
        let arguments = ProcessInfo.processInfo.arguments
        let screenshotTab = arguments.firstIndex(of: "-screenshot-tab")
            .flatMap { arguments.indices.contains($0 + 1) ? arguments[$0 + 1] : nil }
        let tabs = ["home": 0, "opportunities": 1, "calculator": 2, "radar": 3, "learn": 4, "saved": 4]
        selectedTab = tabs[screenshotTab ?? "home"] ?? 0
        isDrawerOpen = arguments.contains("-screenshot-drawer")

        if let index = arguments.firstIndex(of: "-screenshot-language"), arguments.indices.contains(index + 1) {
            language = Language(rawValue: arguments[index + 1]) ?? .english
        } else {
            language = Language(rawValue: UserDefaults.standard.string(forKey: "appLanguage") ?? "") ?? .english
        }
        if arguments.contains("-screenshot-seed-saved") {
            savedIDs = ["personalized-tumblers", "custom-leather-patches"]
        } else {
            savedIDs = Set(UserDefaults.standard.stringArray(forKey: "savedOpportunityIDs") ?? [])
        }
    }

    func toggleSaved(_ id: String) {
        if savedIDs.contains(id) { savedIDs.remove(id) } else { savedIDs.insert(id) }
        UserDefaults.standard.set(Array(savedIDs), forKey: "savedOpportunityIDs")
    }

    func text(_ english: String, _ chinese: String) -> String {
        language == .english ? english : chinese
    }
}

enum Brand {
    static let red = Color(red: 231 / 255, green: 49 / 255, blue: 14 / 255)
    static let ink = Color(red: 13 / 255, green: 14 / 255, blue: 16 / 255)
    static let cream = Color(red: 247 / 255, green: 244 / 255, blue: 238 / 255)
    static let muted = Color(red: 105 / 255, green: 102 / 255, blue: 96 / 255)
}
