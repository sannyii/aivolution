# AIVolution Avatar iOS Prototype

This SwiftUI prototype implements the core screens outlined in the Figma high-fidelity flows and showcases a RealityKit-powered avatar experience.

## Screens
- **SplashView** – gradient intro with animated sparkles before transitioning to the dashboard.
- **DashboardView** – wellbeing KPIs, quick actions, and avatar preview.
- **RecordFormView** – slider-driven logging experience, avatar reaction preview, and save confirmation.
- **AvatarShowcaseView** – full-screen ARView that supports gesture orbit/pan/zoom and playback of sample animations.

## RealityKit Integration
- Loads the avatar model from `avatar_base.usdz`. Place this asset in the app bundle via Xcode's asset catalog.
- Provides fallback `ModelEntity` sphere when the asset is unavailable so that gestures can still be tested in Simulator.
- Custom gesture recognisers update user guidance text and call back to the shared `AvatarViewModel`.

## Running the Prototype
1. Create an Xcode project that references the Swift files in this folder.
2. Add `Privacy - Camera Usage Description` to `Info.plist` because RealityKit requires camera access on device.
3. Include `avatar_base.usdz` in the main bundle for full fidelity.
4. Build and run on an ARKit-capable device to experience gesture interactions.

## Next Steps
- Replace placeholder data with live wellbeing metrics and animation triggers from backend services.
- Synchronise design tokens with Figma exports to maintain visual consistency.
- Extend RealityKit scene with light probes and animation blending once final assets arrive.
