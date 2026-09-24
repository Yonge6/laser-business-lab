import SwiftUI

struct OpportunityCard: View {
    @EnvironmentObject private var appState: AppState
    let opportunity: Opportunity

    var body: some View {
        VStack(spacing: 0) {
            ZStack(alignment: .bottomLeading) {
                Image(opportunity.imageName)
                    .resizable()
                    .scaledToFill()
                    .frame(height: 190)
                    .clipped()
                LinearGradient(colors: [.clear, .black.opacity(0.74)], startPoint: .center, endPoint: .bottom)
                Text("#\(String(format: "%02d", opportunity.rank))")
                    .font(.system(.title, design: .default, weight: .black))
                    .foregroundStyle(.white)
                    .padding(12)
            }
            VStack(alignment: .leading, spacing: 10) {
                SectionEyebrow(text: opportunity.method.rawValue)
                Text(opportunity.title(for: appState.language))
                    .font(.system(.title2, design: .default, weight: .black))
                    .lineLimit(2)
                HStack(alignment: .firstTextBaseline) {
                    Text("\(opportunity.score)")
                        .font(.system(size: 42, weight: .black, design: .default))
                        .foregroundStyle(Brand.red)
                    Text("/100").font(.caption.bold()).foregroundStyle(.secondary)
                    Spacer()
                    VStack(alignment: .trailing) {
                        Text(appState.text("EST. GROSS", "预计毛利")).font(.caption2.bold()).foregroundStyle(.secondary)
                        Text(opportunity.grossProfit.usd).font(.headline.bold())
                    }
                }
            }
            .padding()
            .background(.white)
        }
        .overlay(Rectangle().stroke(Brand.ink.opacity(0.5), lineWidth: 1))
        .contentShape(Rectangle())
        .accessibilityElement(children: .combine)
        .accessibilityHint(appState.text("Opens full opportunity", "打开完整机会"))
    }
}
