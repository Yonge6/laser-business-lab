import SwiftUI

struct OpportunityDetailView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.dismiss) private var dismiss
    let opportunity: Opportunity

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    Image(opportunity.imageName)
                        .resizable()
                        .scaledToFill()
                        .frame(height: 300)
                        .clipped()
                    VStack(alignment: .leading, spacing: 14) {
                        SectionEyebrow(text: "#\(String(format: "%02d", opportunity.rank)) · \(opportunity.method.rawValue)")
                        Text(opportunity.title(for: appState.language))
                            .font(.system(size: 38, weight: .black, design: .default))
                        Text(opportunity.summary(for: appState.language))
                            .font(.title3)
                            .foregroundStyle(Brand.muted)
                        HStack {
                            MetricChip(label: appState.text("Typical price", "典型售价"), value: opportunity.sellingPrice.usd)
                            MetricChip(label: appState.text("Material", "材料成本"), value: opportunity.materialCost.usd)
                        }
                        HStack {
                            MetricChip(label: appState.text("Est. gross", "预计毛利"), value: opportunity.grossProfit.usd)
                            MetricChip(label: appState.text("Production", "制作时间"), value: "\(Int(opportunity.productionMinutes)) min")
                        }

                        Text(appState.text("Verify your own selling fees, labor, failed units, shipping, tax, and marketing before investing.", "投资前，请用自己的平台费、人工、损耗、物流、税费和营销成本重新验证。"))
                            .font(.footnote)
                            .foregroundStyle(Brand.muted)

                        Link(destination: opportunity.equipmentURL) {
                            PrimaryButtonLabel(title: appState.text("View \(opportunity.equipmentName)", "查看 \(opportunity.equipmentName)"), icon: "arrow.up.right")
                        }

                        Button { appState.toggleSaved(opportunity.id) } label: {
                            Label(
                                appState.savedIDs.contains(opportunity.id) ? appState.text("Saved", "已收藏") : appState.text("Save opportunity", "收藏机会"),
                                systemImage: appState.savedIDs.contains(opportunity.id) ? "bookmark.fill" : "bookmark"
                            )
                            .font(.headline)
                            .frame(maxWidth: .infinity, minHeight: 50)
                            .foregroundStyle(Brand.ink)
                            .overlay(Rectangle().stroke(Brand.ink, lineWidth: 1.5))
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.bottom, 30)
            }
            .background(Brand.cream.ignoresSafeArea())
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(appState.text("Done", "完成")) { dismiss() }
                }
            }
        }
    }
}
