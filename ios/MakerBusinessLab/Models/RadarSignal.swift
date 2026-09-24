import Foundation

struct RadarEnvelope: Codable {
    let schemaVersion: Int
    let generatedFor: String
    let opportunity: RadarOpportunity
    let radar: RadarContent
}

struct RadarOpportunity: Codable {
    let id: String
    let title: String
    let titleZh: String
    let score: Int
    let typicalPrice: Double
    let materialCost: Double
    let estimatedGrossProfit: Double
    let productionMinutes: Double
}

struct RadarContent: Codable {
    let weekStarted: String
    let lens: String
    let headline: String
    let headlineZh: String
    let answer: String
    let answerZh: String
    let action: String
    let actionZh: String
    let caveat: String
}
