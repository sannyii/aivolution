import SwiftUI

struct SplashView: View {
    @EnvironmentObject private var navigation: NavigationModel
    @State private var appear = false

    var body: some View {
        ZStack {
            Theme.gradient
                .ignoresSafeArea()
            VStack(spacing: 32) {
                Image(systemName: "sparkles")
                    .font(.system(size: 80))
                    .foregroundColor(.white)
                    .opacity(appear ? 1 : 0.2)
                    .scaleEffect(appear ? 1 : 0.75)
                    .animation(.easeOut(duration: 1).repeatForever(autoreverses: true), value: appear)

                VStack(spacing: 12) {
                    Text("AIVolution")
                        .font(Theme.Typography.title)
                        .foregroundColor(.white)
                    Text("Loading your personalised wellbeing experience")
                        .font(Theme.Typography.body)
                        .foregroundColor(.white.opacity(0.8))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 32)
                }
            }
        }
        .task {
            appear = true
            try? await Task.sleep(nanoseconds: 2_000_000_000)
            await MainActor.run {
                navigation.go(to: .dashboard)
            }
        }
    }
}

struct SplashView_Previews: PreviewProvider {
    static var previews: some View {
        SplashView()
            .environmentObject(NavigationModel())
    }
}
