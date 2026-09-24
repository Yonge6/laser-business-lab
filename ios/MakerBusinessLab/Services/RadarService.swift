import Foundation

actor RadarService {
    static let endpoint = URL(string: "https://maker.wonderelian.com/operations/latest.json")!

    func load() async throws -> RadarEnvelope {
        var request = URLRequest(url: Self.endpoint)
        request.timeoutInterval = 8
        request.cachePolicy = .reloadRevalidatingCacheData
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, 200..<300 ~= http.statusCode else {
            throw URLError(.badServerResponse)
        }
        return try JSONDecoder().decode(RadarEnvelope.self, from: data)
    }

    nonisolated static func fallback() -> RadarEnvelope {
        guard let url = Bundle.main.url(forResource: "radar-fallback", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let value = try? JSONDecoder().decode(RadarEnvelope.self, from: data) else {
            fatalError("Missing radar fallback")
        }
        return value
    }
}
