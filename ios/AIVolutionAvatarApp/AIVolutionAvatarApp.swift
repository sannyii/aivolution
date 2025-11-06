import SwiftUI

@main
struct AIVolutionAvatarApp: App {
    @StateObject private var navigationModel = NavigationModel()
    @StateObject private var avatarViewModel = AvatarViewModel()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(navigationModel)
                .environmentObject(avatarViewModel)
                .preferredColorScheme(.dark)
        }
    }
}
