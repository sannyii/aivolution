import SwiftUI

struct RecordFormView: View {
    @EnvironmentObject private var navigation: NavigationModel
    @EnvironmentObject private var avatarModel: AvatarViewModel

    @State private var mood: Double = 0.7
    @State private var energy: Double = 0.5
    @State private var notes: String = ""
    @State private var showConfirmation = false

    var body: some View {
        VStack(spacing: 24) {
            header
            formBody
            Spacer()
            submitButton
        }
        .padding(24)
        .background(
            LinearGradient(colors: [.black, .indigo.opacity(0.7)], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()
        )
        .alert("Entry saved", isPresented: $showConfirmation) {
            Button("Done") {
                navigation.go(to: .dashboard)
            }
        } message: {
            Text("Great job logging your wellbeing today. Nova is updating insights.")
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            Button {
                navigation.go(to: .dashboard)
            } label: {
                Label("Back", systemImage: "chevron.left")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.7))
            }
            Text("Log today's reflection")
                .font(Theme.Typography.title)
                .foregroundColor(.white)
            Text("Adjust sliders to describe your current state. Nova will animate to mirror your selection.")
                .font(Theme.Typography.body)
                .foregroundColor(.white.opacity(0.7))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var formBody: some View {
        VStack(spacing: 24) {
            sliderCard(title: "Mood", value: $mood, tint: .pink)
            sliderCard(title: "Energy", value: $energy, tint: .teal)

            VStack(alignment: .leading, spacing: 12) {
                Text("Notes")
                    .font(Theme.Typography.headline)
                    .foregroundColor(.white)
                TextEditor(text: $notes)
                    .scrollContentBackground(.hidden)
                    .frame(height: 140)
                    .padding(16)
                    .background(Color.white.opacity(0.05))
                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                    .foregroundColor(.white)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            VStack(alignment: .leading, spacing: 8) {
                Text("Avatar preview")
                    .font(Theme.Typography.headline)
                    .foregroundColor(.white)
                AvatarReactionView(mood: mood, energy: energy)
                    .frame(height: 140)
                    .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
            }
        }
    }

    private func sliderCard(title: String, value: Binding<Double>, tint: Color) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text(title)
                    .font(Theme.Typography.headline)
                    .foregroundColor(.white)
                Spacer()
                Text(value.wrappedValue, format: .number.precision(.fractionLength(2)))
                    .font(Theme.Typography.caption)
                    .foregroundColor(.white.opacity(0.6))
            }
            Slider(value: value, in: 0...1)
                .tint(tint)
        }
        .padding(20)
        .background(Theme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
    }

    private var submitButton: some View {
        Button {
            avatarModel.triggerAnimation(.wave)
            showConfirmation = true
        } label: {
            Text("Save reflection")
                .font(Theme.Typography.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 18)
                .background(Theme.gradient)
                .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        }
        .buttonStyle(.plain)
        .foregroundColor(.white)
    }
}

struct AvatarReactionView: View {
    let mood: Double
    let energy: Double

    var body: some View {
        ZStack {
            Theme.cardBackground
            VStack(spacing: 8) {
                Image(systemName: mood > 0.5 ? "face.smiling" : "face.smiling.inverse")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 60, height: 60)
                    .foregroundColor(.white)
                Text(statusText)
                    .font(Theme.Typography.body)
                    .foregroundColor(.white)
            }
        }
    }

    private var statusText: String {
        switch (mood, energy) {
        case (0.75..., 0.6...):
            return "Nova feels energised"
        case (0.5..., 0.3...):
            return "Nova is centred"
        default:
            return "Nova suggests a mindful break"
        }
    }
}

struct RecordFormView_Previews: PreviewProvider {
    static var previews: some View {
        RecordFormView()
            .environmentObject(NavigationModel())
            .environmentObject(AvatarViewModel())
    }
}
