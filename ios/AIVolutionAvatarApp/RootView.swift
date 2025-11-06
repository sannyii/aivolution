import SwiftUI

struct RootView: View {
    @EnvironmentObject private var navigation: NavigationModel

    var body: some View {
        ZStack {
            switch navigation.currentRoute {
            case .splash:
                SplashView()
            case .dashboard:
                DashboardView()
            case .record:
                RecordFormView()
            case .avatar:
                AvatarShowcaseView()
            }
        }
        .transition(.opacity.combined(with: .scale))
    }
}

struct RootView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
            .environmentObject(NavigationModel())
            .environmentObject(AvatarViewModel())
    }
}
