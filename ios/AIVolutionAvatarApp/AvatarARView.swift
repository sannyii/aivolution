import SwiftUI
import RealityKit
import ARKit

struct AvatarARView: UIViewRepresentable {
    var animation: String?
    var onGesture: (String) -> Void

    func makeUIView(context: Context) -> ARView {
        let arView = ARView(frame: .zero)
        arView.automaticallyConfigureSession = false

        let configuration = ARWorldTrackingConfiguration()
        configuration.planeDetection = [.horizontal]
        configuration.environmentTexturing = .automatic
        arView.session.run(configuration)

        arView.addCoaching()
        context.coordinator.loadAvatar(into: arView)
        context.coordinator.setupGestures(for: arView)
        arView.session.delegate = context.coordinator
        return arView
    }

    func updateUIView(_ uiView: ARView, context: Context) {
        context.coordinator.play(animation: animation, on: uiView)
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(onGesture: onGesture)
    }

    final class Coordinator: NSObject, ARSessionDelegate {
        let onGesture: (String) -> Void
        private var avatarEntity: Entity?
        private var animationControllers: [AnimationPlaybackController] = []

        init(onGesture: @escaping (String) -> Void) {
            self.onGesture = onGesture
        }

        func loadAvatar(into view: ARView) {
            do {
                let entity = try Entity.load(named: "avatar_base")
                entity.scale = [0.6, 0.6, 0.6]
                entity.position = [0, -0.2, -0.6]
                avatarEntity = entity

                let anchor = AnchorEntity(.plane(.horizontal, classification: .any, minimumBounds: [0.2, 0.2]))
                anchor.addChild(entity)
                view.scene.anchors.append(anchor)
            } catch {
                let placeholder = ModelEntity(mesh: .generateSphere(radius: 0.1), materials: [SimpleMaterial(color: .cyan, isMetallic: true)])
                placeholder.position = [0, 0, -0.5]
                avatarEntity = placeholder
                let anchor = AnchorEntity(world: .zero)
                anchor.addChild(placeholder)
                view.scene.anchors.append(anchor)
            }
        }

        func setupGestures(for view: ARView) {
            let rotationGesture = UIPanGestureRecognizer(target: self, action: #selector(handleRotation(_:)))
            rotationGesture.minimumNumberOfTouches = 1
            rotationGesture.maximumNumberOfTouches = 1
            view.addGestureRecognizer(rotationGesture)

            let panGesture = UIPanGestureRecognizer(target: self, action: #selector(handlePan(_:)))
            panGesture.minimumNumberOfTouches = 2
            view.addGestureRecognizer(panGesture)

            let pinchGesture = UIPinchGestureRecognizer(target: self, action: #selector(handlePinch(_:)))
            view.addGestureRecognizer(pinchGesture)

            let doubleTap = UITapGestureRecognizer(target: self, action: #selector(handleDoubleTap(_:)))
            doubleTap.numberOfTapsRequired = 2
            view.addGestureRecognizer(doubleTap)
        }

        @objc private func handleRotation(_ gesture: UIPanGestureRecognizer) {
            guard let entity = avatarEntity else { return }
            let translation = gesture.translation(in: gesture.view)
            let rotationAmount = Float(translation.x) * .pi / 720
            entity.transform.rotation *= simd_quatf(angle: rotationAmount, axis: [0, 1, 0])
            if gesture.state == .changed {
                onGesture("Orbiting avatar")
            }
        }

        @objc private func handlePan(_ gesture: UIPanGestureRecognizer) {
            guard let entity = avatarEntity else { return }
            let translation = gesture.translation(in: gesture.view)
            let x = Float(translation.x) / 500
            let y = Float(translation.y) / 500
            entity.position.x += x
            entity.position.y -= y
            if gesture.state == .changed {
                onGesture("Panning avatar")
            }
        }

        @objc private func handlePinch(_ gesture: UIPinchGestureRecognizer) {
            guard let entity = avatarEntity else { return }
            let scale = Float(gesture.scale)
            entity.scale *= SIMD3(repeating: scale)
            gesture.scale = 1
            if gesture.state == .changed {
                onGesture("Zooming avatar")
            }
        }

        @objc private func handleDoubleTap(_ gesture: UITapGestureRecognizer) {
            guard let entity = avatarEntity else { return }
            entity.setScale([0.6, 0.6, 0.6], relativeTo: nil)
            entity.position = [0, -0.2, -0.6]
            onGesture("Avatar recentered")
        }

        func play(animation: String?, on view: ARView) {
            guard let animation, let entity = avatarEntity else { return }
            animationControllers.forEach { $0.stop() }
            animationControllers.removeAll()
            if let resource = entity.availableAnimations.first(where: { $0.name == animation }) {
                let controller = entity.playAnimation(resource.repeat(), transitionDuration: 0.35, startsPaused: false)
                animationControllers.append(controller)
                onGesture("Playing animation: \(animation)")
            } else {
                onGesture("No animation named \(animation). Showing pulse effect.")
                let pulse = SimpleMaterial(color: .cyan, roughness: 0.2, isMetallic: true)
                entity.model?.materials = [pulse]
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                    entity.model?.materials = [SimpleMaterial(color: .white, roughness: 0.1, isMetallic: false)]
                }
            }
        }
    }
}

private extension ARView {
    func addCoaching() {
        let coachingOverlay = ARCoachingOverlayView()
        coachingOverlay.session = session
        coachingOverlay.goal = .tracking
        coachingOverlay.activatesAutomatically = true
        addSubview(coachingOverlay)
        coachingOverlay.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            coachingOverlay.leadingAnchor.constraint(equalTo: leadingAnchor),
            coachingOverlay.trailingAnchor.constraint(equalTo: trailingAnchor),
            coachingOverlay.topAnchor.constraint(equalTo: topAnchor),
            coachingOverlay.bottomAnchor.constraint(equalTo: bottomAnchor)
        ])
    }
}
