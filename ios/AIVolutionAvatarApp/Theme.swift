import SwiftUI

struct Theme {
    static let gradient = LinearGradient(colors: [Color.indigo, Color.purple], startPoint: .topLeading, endPoint: .bottomTrailing)
    static let cardBackground = Color.white.opacity(0.08)
    static let accent = Color.teal

    struct Typography {
        static let title = Font.system(.largeTitle, design: .rounded).weight(.bold)
        static let headline = Font.system(.title3, design: .rounded).weight(.semibold)
        static let body = Font.system(.body, design: .default)
        static let caption = Font.system(.caption, design: .rounded)
    }
}

struct GlassBackground: ViewModifier {
    func body(content: Content) -> some View {
        content
            .background(.ultraThinMaterial)
            .background(Theme.cardBackground)
            .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .stroke(Color.white.opacity(0.08), lineWidth: 1)
            )
    }
}

extension View {
    func glassCard() -> some View {
        modifier(GlassBackground())
    }
}
