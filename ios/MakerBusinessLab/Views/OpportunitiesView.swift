import SwiftUI

struct OpportunitiesView: View {
    @EnvironmentObject private var appState: AppState
    @State private var method: MakingMethod?
    @State private var query = ""
    @State private var selected: Opportunity?

    private var filtered: [Opportunity] {
        Opportunity.all.filter { item in
            (method == nil || item.method == method) &&
            (query.isEmpty || item.title.localizedCaseInsensitiveContains(query) || item.titleZh.contains(query))
        }
    }

    var body: some View {
        ScrollView {
            LazyVStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    SectionEyebrow(text: appState.text("Opportunity finder", "产品机会发现器"))
                    Text(appState.text("WHAT SHOULD YOU MAKE AND SELL?", "你应该制作并销售什么？"))
                        .font(.system(size: 36, weight: .black, design: .default))
                    Text(appState.text("Ranked starting points—not income promises.", "这些是排序后的起步方向，不是收益承诺。"))
                        .foregroundStyle(Brand.muted)
                }
                .padding(.horizontal)

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        FilterPill(title: appState.text("All", "全部"), active: method == nil) { method = nil }
                        ForEach(MakingMethod.allCases) { option in
                            FilterPill(title: option.rawValue, active: method == option) { method = option }
                        }
                    }
                    .padding(.horizontal)
                }

                ForEach(filtered) { opportunity in
                    OpportunityCard(opportunity: opportunity)
                        .onTapGesture { selected = opportunity }
                        .padding(.horizontal)
                }
            }
            .padding(.bottom, 24)
        }
        .background(Brand.cream.ignoresSafeArea())
        .makerAppHeader()
        .searchable(text: $query, prompt: appState.text("Search products", "搜索产品"))
        .toolbar(.hidden, for: .navigationBar)
        .sheet(item: $selected) { OpportunityDetailView(opportunity: $0) }
    }
}

struct FilterPill: View {
    let title: String
    let active: Bool
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            Text(title.uppercased())
                .font(.system(.subheadline, design: .default, weight: .black))
                .padding(.horizontal, 16)
                .frame(height: 40)
                .foregroundStyle(active ? Color.white : Brand.ink)
                .background(active ? Brand.ink : Color.white)
                .overlay(Rectangle().stroke(Brand.ink, lineWidth: 1))
        }
    }
}
