import SwiftUI

struct CalculatorView: View {
    @EnvironmentObject private var appState: AppState
    @State private var input = ProfitInput(sellingPrice: 32, materialCost: 8.2, packagingCost: 1.5, laborCost: 4, platformFeePercent: 10, monthlyOrders: 100, machinePrice: 3_000)
    @FocusState private var focusedField: CalculatorField?

    private var result: ProfitResult { ProfitCalculator.calculate(input) }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                VStack(alignment: .leading, spacing: 8) {
                    SectionEyebrow(text: appState.text("Free maker business tool", "免费 Maker 商业工具"))
                    Text(appState.text("WILL THIS PRODUCT MAKE MONEY?", "这个产品能赚钱吗？"))
                        .font(.system(size: 38, weight: .black, design: .default))
                    Text(appState.text("Model contribution margin and machine payback with your own assumptions.", "用你自己的假设测算贡献毛利与设备回本周期。"))
                        .foregroundStyle(Brand.muted)
                }
                .padding(.horizontal)

                VStack(spacing: 14) {
                    MoneyField(title: appState.text("Selling price", "售价"), value: $input.sellingPrice, field: .sellingPrice, focusedField: $focusedField)
                    MoneyField(title: appState.text("Material cost", "材料成本"), value: $input.materialCost, field: .materialCost, focusedField: $focusedField)
                    MoneyField(title: appState.text("Packaging cost", "包装成本"), value: $input.packagingCost, field: .packagingCost, focusedField: $focusedField)
                    MoneyField(title: appState.text("Labor per item", "单件人工"), value: $input.laborCost, field: .laborCost, focusedField: $focusedField)
                    NumberField(title: appState.text("Platform fee %", "平台费 %"), value: $input.platformFeePercent, field: .platformFee, focusedField: $focusedField)
                    NumberField(title: appState.text("Monthly orders", "月订单量"), value: $input.monthlyOrders, field: .monthlyOrders, focusedField: $focusedField)
                    MoneyField(title: appState.text("Machine investment", "设备投入"), value: $input.machinePrice, field: .machineInvestment, focusedField: $focusedField)
                }
                .padding()
                .background(.white)
                .overlay(Rectangle().stroke(Brand.ink.opacity(0.35)))
                .padding(.horizontal)

                VStack(alignment: .leading, spacing: 14) {
                    SectionEyebrow(text: appState.text("Planning result", "规划结果"))
                    Text(result.monthlyContribution.usd)
                        .font(.system(size: 52, weight: .black, design: .default))
                        .foregroundStyle(.white)
                    Text(appState.text("EST. MONTHLY CONTRIBUTION", "预计月度贡献毛利"))
                        .font(.caption.bold())
                        .foregroundStyle(.white.opacity(0.7))
                    HStack {
                        ResultCell(label: appState.text("Per item", "单件贡献"), value: result.contributionPerItem.usd)
                        ResultCell(label: appState.text("Margin", "贡献毛利率"), value: result.marginPercent.formatted(.number.precision(.fractionLength(0))) + "%")
                        ResultCell(label: appState.text("Payback", "回本周期"), value: result.paybackMonths.map { $0.formatted(.number.precision(.fractionLength(1))) + " mo" } ?? "—")
                    }
                    Divider().overlay(.white.opacity(0.2))
                    Text(appState.text("Planning estimate only. It is not a demand forecast or earnings promise.", "仅为规划估算，不代表需求预测或收益承诺。"))
                        .font(.footnote)
                        .foregroundStyle(.white.opacity(0.7))
                }
                .padding()
                .background(Brand.ink)
                .padding(.horizontal)
            }
            .padding(.bottom, 28)
        }
        .scrollDismissesKeyboard(.interactively)
        .background(Brand.cream.ignoresSafeArea())
        .makerAppHeader()
        .toolbar {
            ToolbarItemGroup(placement: .keyboard) {
                Spacer()
                Button(appState.text("Done", "完成")) {
                    focusedField = nil
                }
                .fontWeight(.bold)
            }
        }
        .toolbar(.hidden, for: .navigationBar)
    }
}

enum CalculatorField: Hashable {
    case sellingPrice
    case materialCost
    case packagingCost
    case laborCost
    case platformFee
    case monthlyOrders
    case machineInvestment
}

struct MoneyField: View {
    let title: String
    @Binding var value: Double
    let field: CalculatorField
    let focusedField: FocusState<CalculatorField?>.Binding

    var body: some View {
        NumberField(title: title, value: $value, prefix: "$ ", field: field, focusedField: focusedField)
    }
}

struct NumberField: View {
    let title: String
    @Binding var value: Double
    var prefix: String = ""
    let field: CalculatorField
    let focusedField: FocusState<CalculatorField?>.Binding

    var body: some View {
        HStack {
            Text(title).font(.subheadline.bold())
            Spacer()
            HStack(spacing: 2) {
                Text(prefix).foregroundStyle(Brand.red).fontWeight(.black)
                TextField("0", value: $value, format: .number.precision(.fractionLength(0...2)))
                    .keyboardType(.decimalPad)
                    .focused(focusedField, equals: field)
                    .multilineTextAlignment(.trailing)
                    .frame(width: 110)
                    .font(.title3.bold())
            }
        }
        .padding(.vertical, 6)
        .overlay(alignment: .bottom) { Divider() }
    }
}

struct ResultCell: View {
    let label: String
    let value: String
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(value).font(.headline.bold()).foregroundStyle(.white)
            Text(label.uppercased()).font(.caption2.bold()).foregroundStyle(.white.opacity(0.6))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
