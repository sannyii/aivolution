import SwiftUI

struct DashboardView: View {
    @EnvironmentObject private var navigation: NavigationModel
    @EnvironmentObject private var avatarModel: AvatarViewModel

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    header
                    wellbeingCards
                    quickActions
                    avatarPreview
                }
                .padding(.vertical, 32)
            }
            .background(
                LinearGradient(gradient: Gradient(colors: [.black, .indigo.opacity(0.6)]), startPoint: .top, endPoint: .bottom)
                    .ignoresSafeArea()
            )
            .toolbar(.hidden, for: .navigationBar)
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Welcome back, Nova")
                .font(Theme.Typography.title)
                .foregroundColor(.white)
            Text("You are on a 7 day streak. Keep exploring your wellbeing insights!")
                .font(Theme.Typography.body)
                .foregroundColor(.white.opacity(0.7))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 24)
    }

    private var wellbeingCards: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                WellbeingCard(title: "Mood", value: "Upbeat", delta: "+8%", icon: "sun.max.fill", gradient: [.purple, .pink])
                WellbeingCard(title: "Energy", value: "Balanced", delta: "Stable", icon: "bolt.fill", gradient: [.blue, .indigo])
                WellbeingCard(title: "Focus", value: "Deep", delta: "+12%", icon: "brain.head.profile", gradient: [.teal, .green])
            }
            .padding(.horizontal, 24)
        }
    }

    private var quickActions: some View {
        VStack(spacing: 16) {
            Text("Quick Actions")
                .font(Theme.Typography.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, alignment: .leading)
            HStack(spacing: 16) {
                ActionButton(title: "Log feeling", icon: "heart.text.square.fill") {
                    navigation.go(to: .record)
                }
                ActionButton(title: "Play animation", icon: "sparkle") {
                    avatarModel.triggerAnimation(.celebrate)
                    navigation.go(to: .avatar)
                }
            }
            HStack(spacing: 16) {
                ActionButton(title: "Breathing", icon: "wind") {
                    avatarModel.triggerAnimation(.breathe)
                    navigation.go(to: .avatar)
                }
                ActionButton(title: "Avatar studio", icon: "person.crop.square") {
                    navigation.go(to: .avatar)
                }
            }
        }
        .padding(24)
        .glassCard()
        .padding(.horizontal, 24)
    }

    private var avatarPreview: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Today's Avatar Mood")
                .font(Theme.Typography.headline)
                .foregroundColor(.white)
            HStack(alignment: .center, spacing: 20) {
                Image(systemName: "person.crop.circle.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .foregroundStyle(Theme.gradient)
                VStack(alignment: .leading, spacing: 8) {
                    Text("Nova is ready to guide you.")
                        .font(Theme.Typography.body)
                        .foregroundColor(.white)
                    Text("Tap to enter the 3D studio.")
                        .font(Theme.Typography.caption)
                        .foregroundColor(.white.opacity(0.7))
                }
                Spacer()
                Button {
                    navigation.go(to: .avatar)
                } label: {
                    Image(systemName: "chevron.right")
                        .font(.title2)
                        .foregroundColor(.white)
                        .padding(12)
                        .background(Theme.cardBackground)
                        .clipShape(Circle())
                }
            }
            .padding(20)
            .glassCard()
        }
        .padding(.horizontal, 24)
    }
}

private struct WellbeingCard: View {
    let title: String
    let value: String
    let delta: String
    let icon: String
    let gradient: [Color]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.white)
            Text(value)
                .font(Theme.Typography.headline)
                .foregroundColor(.white)
            Text(delta)
                .font(Theme.Typography.caption)
                .foregroundColor(.white.opacity(0.7))
            Spacer()
            Text(title.uppercased())
                .font(.caption2)
                .foregroundColor(.white.opacity(0.6))
        }
        .padding(20)
        .frame(width: 180, height: 200)
        .background(
            LinearGradient(colors: gradient, startPoint: .topLeading, endPoint: .bottomTrailing)
        )
        .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
    }
}

private struct ActionButton: View {
    let title: String
    let icon: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.title3)
                Text(title)
                    .font(Theme.Typography.body)
                    .fontWeight(.semibold)
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 18)
            .background(Theme.cardBackground)
            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

struct DashboardView_Previews: PreviewProvider {
    static var previews: some View {
        DashboardView()
            .environmentObject(NavigationModel())
            .environmentObject(AvatarViewModel())
    }
}
