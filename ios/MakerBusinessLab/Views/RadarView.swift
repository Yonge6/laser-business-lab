import SwiftUI

struct RadarView: View {
    @EnvironmentObject private var appState: AppState
    @State private var signal = RadarService.fallback()
    @State private var isLive = false
    @State private var loading = true

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                VStack(alignment: .leading, spacing: 10) {
                    SectionEyebrow(text: appState.text("Today's Maker signal", "今日 Maker 信号"))
                    HStack {
                        Label(isLive ? appState.text("Live data", "实时数据") : appState.text("Offline snapshot", "离线快照"), systemImage: isLive ? "bolt.horizontal.fill" : "arrow.down.circle")
                            .font(.caption.bold())
                        Spacer()
                        if loading { ProgressView() }
                    }
                    Text(appState.language == .english ? signal.radar.headline : signal.radar.headlineZh)
                        .font(.system(size: 38, weight: .black, design: .default))
                    Text(appState.language == .english ? signal.radar.answer : signal.radar.answerZh)
                        .font(.title3)
                        .foregroundStyle(Brand.muted)
                }
                .padding(.horizontal)

                Image("SignalHero")
                    .resizable()
                    .scaledToFill()
                    .frame(height: 320)
                    .clipped()
                    .overlay(alignment: .bottomLeading) {
                        LinearGradient(colors: [.clear, .black.opacity(0.8)], startPoint: .center, endPoint: .bottom)
                        VStack(alignment: .leading) {
                            Text("#\(signal.opportunity.score)")
                                .font(.system(size: 52, weight: .black, design: .default))
                            Text(appState.language == .english ? signal.opportunity.title : signal.opportunity.titleZh)
                                .font(.title2.bold())
                        }
                        .foregroundStyle(.white)
                        .padding()
                    }
                    .padding(.horizontal)

                HStack {
                    MetricChip(label: appState.text("Typical price", "典型售价"), value: signal.opportunity.typicalPrice.usd)
                    MetricChip(label: appState.text("Material", "材料成本"), value: signal.opportunity.materialCost.usd)
                }
                .padding(.horizontal)

                VStack(alignment: .leading, spacing: 12) {
                    SectionEyebrow(text: appState.text("Next evidence", "下一项证据"))
                    Text(appState.language == .english ? signal.radar.action : signal.radar.actionZh)
                        .font(.system(.title2, design: .default, weight: .black))
                    Divider()
                    Text(signal.radar.caveat)
                        .font(.footnote)
                        .foregroundStyle(.white.opacity(0.7))
                }
                .padding()
                .foregroundStyle(.white)
                .background(Brand.ink)
                .padding(.horizontal)
            }
            .padding(.bottom, 28)
        }
        .background(Brand.cream.ignoresSafeArea())
        .makerAppHeader()
        .toolbar(.hidden, for: .navigationBar)
        .refreshable { await refresh() }
        .task { await refresh() }
    }

    private func refresh() async {
        loading = true
        defer { loading = false }
        if let fresh = try? await RadarService().load() {
            signal = fresh
            isLive = true
        } else {
            signal = RadarService.fallback()
            isLive = false
        }
    }
}
