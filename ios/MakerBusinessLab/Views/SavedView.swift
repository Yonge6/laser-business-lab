import SwiftUI

struct SavedView: View {
    @EnvironmentObject private var appState: AppState
    @State private var selected: Opportunity?

    private var saved: [Opportunity] { Opportunity.all.filter { appState.savedIDs.contains($0.id) } }

    var body: some View {
        ScrollView {
            LazyVStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    SectionEyebrow(text: appState.text("Your shortlist", "你的候选清单"))
                    Text(appState.text("SAVE THE DECISION, NOT THE HYPE.", "收藏决策，不收藏冲动。"))
                        .font(.system(size: 36, weight: .black, design: .default))
                }
                .padding(.horizontal)

                if saved.isEmpty {
                    ContentUnavailableView(
                        appState.text("No saved opportunities", "还没有收藏机会"),
                        systemImage: "bookmark",
                        description: Text(appState.text("Open an opportunity and save the ones worth validating.", "打开机会，把值得验证的方向加入清单。"))
                    )
                    .frame(minHeight: 360)
                } else {
                    ForEach(saved) { opportunity in
                        OpportunityCard(opportunity: opportunity)
                            .onTapGesture { selected = opportunity }
                            .padding(.horizontal)
                    }
                }
            }
            .padding(.bottom, 28)
        }
        .background(Brand.cream.ignoresSafeArea())
        .makerAppHeader()
        .toolbar(.hidden, for: .navigationBar)
        .sheet(item: $selected) { OpportunityDetailView(opportunity: $0) }
    }
}
