import Foundation

struct ProfitInput: Equatable {
    var sellingPrice: Double
    var materialCost: Double
    var packagingCost: Double
    var laborCost: Double
    var platformFeePercent: Double
    var monthlyOrders: Double
    var machinePrice: Double
}

struct ProfitResult: Equatable {
    let contributionPerItem: Double
    let marginPercent: Double
    let monthlyContribution: Double
    let paybackMonths: Double?
}

enum ProfitCalculator {
    static func calculate(_ input: ProfitInput) -> ProfitResult {
        let price = max(0, input.sellingPrice)
        let fee = price * min(max(input.platformFeePercent, 0), 100) / 100
        let contribution = max(0, price - max(0, input.materialCost) - max(0, input.packagingCost) - max(0, input.laborCost) - fee)
        let monthly = contribution * max(0, input.monthlyOrders)
        return ProfitResult(
            contributionPerItem: contribution,
            marginPercent: price > 0 ? contribution / price * 100 : 0,
            monthlyContribution: monthly,
            paybackMonths: monthly > 0 ? max(0, input.machinePrice) / monthly : nil
        )
    }
}
