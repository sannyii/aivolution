import Foundation

final class AvatarViewModel: ObservableObject {
    @Published var isAnimating: Bool = false
    @Published var lastGestureDescription: String = ""
    @Published var currentAnimation: String? = nil

    func triggerAnimation(_ animation: AvatarAnimation) {
        currentAnimation = animation.rawValue
        isAnimating = true

        DispatchQueue.main.asyncAfter(deadline: .now() + animation.duration) {
            self.isAnimating = false
            self.currentAnimation = nil
        }
    }

    func updateGestureDescription(_ description: String) {
        guard description != lastGestureDescription else { return }
        lastGestureDescription = description
    }
}

enum AvatarAnimation: String, CaseIterable {
    case wave
    case celebrate
    case breathe

    var duration: TimeInterval {
        switch self {
        case .wave: return 1.8
        case .celebrate: return 2.4
        case .breathe: return 3.2
        }
    }

    var displayName: String {
        switch self {
        case .wave: return "Wave"
        case .celebrate: return "Celebrate"
        case .breathe: return "Breathe"
        }
    }
}
