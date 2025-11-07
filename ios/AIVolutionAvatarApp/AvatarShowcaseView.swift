import SwiftUI
import RealityKit
import ARKit

struct AvatarShowcaseView: View {
    @EnvironmentObject private var navigation: NavigationModel
    @EnvironmentObject private var avatarModel: AvatarViewModel
    @State private var showHelp = false

    var body: some View {
        ZStack(alignment: .topLeading) {
            AvatarARView(animation: avatarModel.currentAnimation, onGesture: avatarModel.updateGestureDescription)
                .edgesIgnoringSafeArea(.all)

            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Button {
                        navigation.go(to: .dashboard)
                    } label: {
                        Label("Back", systemImage: "chevron.left")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.white)
                            .padding(12)
                            .background(Color.black.opacity(0.4))
                            .clipShape(Circle())
                    }

                    Spacer()

                    Button {
                        showHelp.toggle()
                    } label: {
                        Image(systemName: "questionmark.circle")
                            .font(.title2)
                            .foregroundColor(.white)
                            .padding(12)
                            .background(Color.black.opacity(0.4))
                            .clipShape(Circle())
                    }
                }

                VStack(alignment: .leading, spacing: 8) {
                    Text("3D Avatar Studio")
                        .font(Theme.Typography.headline)
                        .foregroundColor(.white)
                    Text(avatarModel.lastGestureDescription.isEmpty ? "Use one finger to orbit, two fingers to pan, pinch to zoom." : avatarModel.lastGestureDescription)
                        .font(Theme.Typography.caption)
                        .foregroundColor(.white.opacity(0.8))
                        .lineLimit(2)
                }
                .padding(16)
                .background(Color.black.opacity(0.35))
                .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
            }
            .padding(.horizontal, 24)
            .padding(.top, 48)
        }
        .sheet(isPresented: $showHelp) {
            GestureHelpSheet()
                .presentationDetents([.medium])
        }
        .overlay(alignment: .bottom) {
            animationPanel
        }
    }

    private var animationPanel: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                ForEach(AvatarAnimation.allCases, id: \.self) { animation in
                    Button {
                        avatarModel.triggerAnimation(animation)
                    } label: {
                        VStack(spacing: 8) {
                            Image(systemName: icon(for: animation))
                                .font(.title2)
                                .foregroundColor(.white)
                                .padding()
                                .background(avatarModel.currentAnimation == animation.rawValue ? Theme.gradient : Color.black.opacity(0.4))
                                .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
                            Text(animation.displayName)
                                .font(Theme.Typography.caption)
                                .foregroundColor(.white.opacity(0.9))
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(24)
        }
        .background(.ultraThinMaterial)
    }

    private func icon(for animation: AvatarAnimation) -> String {
        switch animation {
        case .wave: return "hand.wave"
        case .celebrate: return "sparkles"
        case .breathe: return "wind"
        }
    }
}

struct GestureHelpSheet: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Capsule()
                .fill(Color.secondary)
                .frame(width: 40, height: 4)
                .frame(maxWidth: .infinity)
            Text("Gesture Tips")
                .font(Theme.Typography.headline)
            VStack(alignment: .leading, spacing: 12) {
                Label("Orbit: drag with one finger", systemImage: "hand.point.up.left")
                Label("Pan: drag with two fingers", systemImage: "hand.point.up.left.fill")
                Label("Zoom: pinch with two fingers", systemImage: "arrow.up.left.and.arrow.down.right")
                Label("Double tap: recenter avatar", systemImage: "arrow.counterclockwise")
            }
            .font(Theme.Typography.body)
            Spacer()
        }
        .padding(28)
    }
}

struct AvatarShowcaseView_Previews: PreviewProvider {
    static var previews: some View {
        AvatarShowcaseView()
            .environmentObject(NavigationModel())
            .environmentObject(AvatarViewModel())
    }
}
