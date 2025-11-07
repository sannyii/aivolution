# AIVolution Avatar App Prototypes

This document captures the interaction flow and fidelity progression for the Figma prototypes that support the SwiftUI implementation.

## Prototype Goals
- Guide users from launch to an interactive avatar dashboard.
- Streamline daily record entry with contextual prompts.
- Showcase a 3D avatar with gesture-driven interactions and quick animations.

## Interaction Flow Overview
1. **Splash Screen** – Displays brand animation while the app loads profile and avatar assets.
2. **Onboarding Snapshot** – Presents today's wellbeing summary with call-to-action to open the dashboard.
3. **Main Dashboard** – Provides KPIs, streaks, and quick actions for logging feelings or activities.
4. **Record Form** – Enables users to capture mood, energy, and notes with preview of avatar response.
5. **3D Avatar Showcase** – Offers immersive interaction with the avatar, including gesture-based rotations and animation triggers.
6. **Completion State** – Confirms the log submission and suggests next steps.

## Low-Fidelity Wireframes
- Grayscale panels focusing on layout hierarchy and navigation.
- Sticky action buttons for quick log entry from any primary screen.
- Avatar placeholder block representing 3D viewport, emphasising adequate safe area padding.

## Mid-Fidelity Prototype
- Introduces color tokens: `Indigo 600` primary, `Teal 300` accents, `Slate` neutrals.
- Typography locked to SF Rounded for headings and SF Pro Text for body content.
- Basic micro-interactions: button hover states, form validation hints.

## High-Fidelity Prototype
- Integrates branded gradients on Splash (Radial Indigo → Purple).
- Dashboard cards use glassmorphism (blur + translucency) for elevated sections.
- Avatar viewport displays lighting mockups and gesture hints (rotate, pinch, double tap).
- Transition specs: Splash → Dashboard (fade/scale 0.6s), Dashboard → Record Form (slide up 0.4s), Dashboard → Avatar (modal card 0.5s).

## Handoff Notes
- Figma component library includes buttons, cards, form fields, status chips, and gesture overlays.
- Exported assets: `avatar_base.usdz`, `icon_gesture_rotate.pdf`, `icon_gesture_pinch.pdf`.
- Animation tokens defined for SwiftUI with easing curves matching Figma prototypes.

## Next Steps
- Align design tokens with the SwiftUI `Theme` struct.
- Connect Figma inspect mode with developer comments for measurement and padding specs.
- Maintain prototype revision log in this repository as features evolve.
