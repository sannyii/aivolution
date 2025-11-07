import Foundation
import Combine

enum AppRoute: Hashable {
    case splash
    case dashboard
    case record
    case avatar
}

final class NavigationModel: ObservableObject {
    @Published var currentRoute: AppRoute = .splash

    func go(to route: AppRoute) {
        withAnimation(.easeInOut(duration: 0.35)) {
            currentRoute = route
        }
    }
}
