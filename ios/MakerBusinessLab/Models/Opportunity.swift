import Foundation

enum MakingMethod: String, CaseIterable, Identifiable, Codable {
    case laser = "Laser"
    case printing3D = "3D Printing"
    case heatPress = "Heat Press"
    var id: String { rawValue }
}

struct Opportunity: Identifiable, Hashable, Codable {
    let id: String
    let rank: Int
    let title: String
    let titleZh: String
    let method: MakingMethod
    let score: Int
    let sellingPrice: Double
    let materialCost: Double
    let productionMinutes: Double
    let imageName: String
    let summary: String
    let summaryZh: String
    let equipmentName: String
    let equipmentURL: URL

    var grossProfit: Double { max(0, sellingPrice - materialCost) }
    var margin: Double { sellingPrice > 0 ? grossProfit / sellingPrice : 0 }

    func title(for language: AppState.Language) -> String { language == .english ? title : titleZh }
    func summary(for language: AppState.Language) -> String { language == .english ? summary : summaryZh }
}

extension Opportunity {
    static let all: [Opportunity] = [
        .init(id: "personalized-tumblers", rank: 1, title: "Personalized Tumblers", titleZh: "个性化保温杯", method: .laser, score: 82, sellingPrice: 32, materialCost: 8.2, productionMinutes: 4, imageName: "Tumbler", summary: "Repeatable blanks make personalization and price testing practical.", summaryZh: "标准化杯坯便于测试定价，也适合个性化与重复订单。", equipmentName: "OneLaser VertiGo", equipmentURL: URL(string: "https://www.1laser.com/products/vertigo-vertical-laser-engraver?utm_source=elian")!),
        .init(id: "laser-leather-patches", rank: 2, title: "Custom Leather Patches", titleZh: "定制皮革章", method: .laser, score: 79, sellingPrice: 11, materialCost: 1.9, productionMinutes: 3, imageName: "LeatherPatch", summary: "Low material cost and fast batching support niche and wholesale tests.", summaryZh: "低材料成本与快速批量加工，适合测试细分风格和小额批发订单。", equipmentName: "OneLaser XRF", equipmentURL: URL(string: "https://www.1laser.com/products/onelaser-xrf-desktop-laser-machine?utm_source=elian")!),
        .init(id: "heat-press-tote-bags", rank: 3, title: "Personalized Heat-Press Totes", titleZh: "定制热转印托特包", method: .heatPress, score: 78, sellingPrice: 24, materialCost: 7.8, productionMinutes: 6, imageName: "HeatPressTote", summary: "Standard blanks and ready-to-press transfers make design testing fast.", summaryZh: "标准坯料配合即烫转印图，可快速测试活动与本地品牌设计。", equipmentName: "xTool WonderPress", equipmentURL: URL(string: "https://www.xtool.com/collections/shop-all/products/xtool-wonderpress-modular-auto-heat-press-for-2d-transfers-and-3d-creations?utm_source=elian")!),
        .init(id: "layered-wood-wall-art", rank: 4, title: "Layered Wood Wall Art", titleZh: "分层木艺壁饰", method: .laser, score: 77, sellingPrice: 89, materialCost: 24, productionMinutes: 55, imageName: "WoodArt", summary: "Layer count, size, and finish support premium repeatable variants.", summaryZh: "层数、尺寸和表面处理可组合成高客单且可重复生产的版本。", equipmentName: "OneLaser Hydra 9 Gen 2", equipmentURL: URL(string: "https://www.1laser.com/products/hydra-9-gen-2-70w-rf-co2-dual-laser-machine?utm_source=elian")!),
        .init(id: "3d-desk-organizers", rank: 5, title: "3D-Printed Desk Organizers", titleZh: "3D 打印桌面收纳", method: .printing3D, score: 76, sellingPrice: 29.99, materialCost: 11.59, productionMinutes: 210, imageName: "DeskOrganizer", summary: "Size, modularity, and niche workflows create useful differentiation.", summaryZh: "尺寸、模块化和细分场景能形成实用差异。", equipmentName: "Bambu Lab 3D Printers", equipmentURL: URL(string: "https://us.store.bambulab.com/collections/3d-printer?utm_source=elian")!),
        .init(id: "3d-geometric-planters", rank: 6, title: "3D-Printed Planters", titleZh: "3D 打印几何花盆", method: .printing3D, score: 74, sellingPrice: 34, materialCost: 8.5, productionMinutes: 480, imageName: "Planter", summary: "Geometry, color, and drainage create room for design-led pricing.", summaryZh: "造型、配色和排水结构能形成差异，为设计溢价创造空间。", equipmentName: "Bambu Lab 3D Printers", equipmentURL: URL(string: "https://us.store.bambulab.com/collections/3d-printer?utm_source=elian")!),
        .init(id: "acrylic-wedding-signs", rank: 7, title: "Acrylic Wedding Signs", titleZh: "亚克力婚礼标牌", method: .laser, score: 73, sellingPrice: 59.99, materialCost: 32.39, productionMinutes: 24, imageName: "AcrylicSign", summary: "Higher-ticket event work rewards personalization and local partnerships.", summaryZh: "高客单活动产品适合个性化，并能通过本地婚庆合作获客。", equipmentName: "OneLaser Cobra 10", equipmentURL: URL(string: "https://www.1laser.com/products/cobra-10-100w-co2-laser-engraver-cutter?utm_source=elian")!)
    ]
}
