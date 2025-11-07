# iOS Data Integration Blueprint

## Framework Evaluations

### Screen Time API (Family Controls)
- **Primary Data**: Device/application usage duration, number of pickups, categories, web domains, managed schedules.
- **Entitlements**: Requires `com.apple.developer.familycontrols` entitlement and Family Controls capability in Apple Developer portal.
- **Authorization Flow**:
  1. Instantiate `AuthorizationCenter.shared.requestAuthorization(for:)` specifying the `.individual` scope for the user's own device or `.child` for managed child devices.
  2. Present the system Family Controls consent sheet; users grant access per device and select which categories/apps can be monitored.
  3. Persist the returned `AuthorizationStatus` to determine whether data collection can proceed.
- **Data Access APIs**: Use `DeviceActivityCenter` and `ManagedSettingsStore` to subscribe to usage reports and limits.
- **Refresh & Revocation**: Monitor `AuthorizationCenter.shared.authorizationStatus` for changes and handle `Notification.Name.authorizationDidChange` to react to revocations.

### HealthKit
- **Primary Data**: Activity summaries (steps, distance, flights climbed), workouts, heart rate, sleep analysis, mindfulness minutes, dietary metrics.
- **Authorization Flow**:
  1. Ensure device supports HealthKit via `HKHealthStore.isHealthDataAvailable()` and declare `NSHealthShareUsageDescription` / `NSHealthUpdateUsageDescription`.
  2. Build read/write sets (`Set<HKObjectType>`) and call `requestAuthorization(toShare:read:)` on `HKHealthStore`.
  3. Evaluate `HKAuthorizationStatus` per data type; use `HKHealthStore.handleAuthorizationForExtension` for background delivery.
- **Background Delivery**: Register for background updates with `enableBackgroundDelivery` and `HKObserverQuery`.
- **Data Granularity**: Query statistics by date (`HKStatisticsQuery`), samples (`HKSampleQuery`), or anchored objects for incremental syncs.

### CoreMotion
- **Primary Data**: Pedometer counts, floor climbs, distance, cadence, accelerometer/gyro data, device motion, fall detection events.
- **Authorization Flow**:
  1. Call `CMPedometer.authorizationStatus()` or `CMMotionActivityManager.authorizationStatus()` to inspect state.
  2. For first-time access, start updates (`startPedometerUpdates`, `startActivityUpdates`) which implicitly trigger the system prompt.
  3. Handle restricted/denied states by prompting the user to open Settings (`UIApplication.openSettingsURLString`).
- **Data Retrieval**: Use historical queries (`queryPedometerData`, `queryActivityStarting`) and real-time updates.
- **Power Considerations**: Batch requests where possible; stop updates when not needed.

### Core Location
- **Primary Data**: GPS coordinates, course, speed, altitude, geofencing events, visit monitoring.
- **Authorization Flow**:
  1. Declare `NSLocationWhenInUseUsageDescription` and/or `NSLocationAlwaysAndWhenInUseUsageDescription`.
  2. Instantiate `CLLocationManager` and call `requestWhenInUseAuthorization` or `requestAlwaysAuthorization`.
  3. Implement delegate callbacks to respond to `didChangeAuthorization` and `didFailWithError`.
- **Data Modes**: Significant-change, standard, visit, and geofence monitoring depending on energy/cadence requirements.
- **Background Access**: For Always permissions, ensure background modes (`location updates`, `processing`) are enabled and provide usage descriptions.

## Unified Permission Request & State Manager

### Objectives
- Normalize authorization states across frameworks (Not Determined, Denied, Restricted, Limited, Authorized).
- Decouple UI presentation from framework-specific logic.
- Support re-prompting flows, settings handoffs, and observable state updates for UI.

### Architecture
- **Permission Registry**: Enum `DataDomain` (screenTime, health, motion, location) mapping to protocol-conforming permission handlers.
- **PermissionHandler Protocol**:
  ```swift
  protocol PermissionHandler {
      var domain: DataDomain { get }
      var currentStatus: PermissionStatus { get }
      func requestAccess(presentationAnchor: UIWindowScene) async throws -> PermissionStatus
      func makeSettingsURL() -> URL?
  }
  ```
- **State Machine**:
  - `notDetermined` → request → `.authorized` / `.limited` / `.denied`.
  - `.denied` / `.restricted` → present education UI + deep link to Settings.
  - `.limited` (HealthKit sample types, Screen Time category filters) → provide management UI to expand scope.
- **Coordinator**:
  - Maintains in-memory cache plus persisted snapshots in user defaults or database to avoid redundant prompts.
  - Emits `Combine` publishers / async streams for UI components.
  - Implements exponential backoff for retrying failed requests (e.g., HealthKit errors) and logs diagnostics.
- **User Experience**:
  - First launch: display onboarding describing data usage, then sequentially request permissions based on dependency order (Screen Time → Health → Motion → Location).
  - Subsequent launches: check stored status; if `.denied`, show non-blocking reminder with CTA to open Settings.

## Encrypted Local Storage Strategy

### Keychain Usage
- Store credentials, refresh tokens, and symmetric encryption keys.
- Use `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` to support background uploads while protecting against device migration.
- Apply Secure Enclave (`SecKeyCreateRandomKey`) for asymmetric keys when available.

### Structured Data Store
- **Option A: Core Data**
  - Define entities `UsageSample`, `HealthSample`, `MotionSample`, `LocationSample` with shared `metadata` blob and timestamps.
  - Utilize `NSPersistentCloudKitContainer` if future iCloud sync is desired; otherwise use SQLite backing store.
  - Encrypt payload fields using AES-GCM with keys sourced from Keychain.
  - Enable `NSPersistentStoreRemoteChangeNotificationPostOptionKey` for background change handling.
- **Option B: Realm**
  - Simpler schema migrations, built-in encryption via `RLMRealmConfiguration.encryptionKey` retrieved from Keychain.
  - Support live objects/notifications for UI binding.

### Data Lifecycle
- Normalize raw data to internal schema upon ingestion with provenance fields (`source`, `sampleType`, `granularity`).
- Implement retention policies (e.g., purge older than 90 days) using background contexts or Realm write transactions.
- Maintain audit trail of consent scope changes linked to stored data batches.

## Background Upload Plan

1. **Task Scheduling**
   - Register `BGProcessingTaskRequest` for heavy uploads (requires `processing` background mode).
   - Use `BGAppRefreshTaskRequest` for lightweight sync or token refresh.
   - Schedule after each successful ingestion, respecting `earliestBeginDate` based on network conditions and battery level.

2. **Execution Pipeline**
   - Upon task execution:
     1. Resolve pending batches from Core Data/Realm filtered by `uploaded == false`.
     2. Decrypt records in-memory, stream to upload service with chunked requests.
     3. Mark batches as uploaded and delete sensitive payloads if retention requires.
   - Handle HealthKit-specific background delivery by linking `HKObserverQuery` callbacks to schedule uploads promptly.

3. **Resilience & Monitoring**
   - Persist last upload timestamps and error metadata for analytics.
   - Implement retry with exponential backoff; cap attempts per batch to avoid loops.
   - Surface critical failures via `OSLog` and optionally push to remote logging.
   - Ensure background tasks call completion handlers within allotted time, requesting additional background time if needed (`beginBackgroundTask`).

4. **Security Considerations**
   - Use `URLSession` background configurations with TLS pinning where possible.
   - Clear sensitive data from memory after upload.
   - Require device to be unlocked for initial key derivation; subsequent background uploads rely on `AfterFirstUnlock` accessibility.

## Authorization & Data Field Matrix

| Domain | Key Data Fields | Authorization Entry Point | Re-auth Strategy |
| --- | --- | --- | --- |
| Screen Time | App category usage, web domains, device activity events | `AuthorizationCenter.shared.requestAuthorization` | Listen for `authorizationDidChange` and prompt Settings deep link |
| HealthKit | Steps, heart rate, sleep, workouts, mindfulness, nutrition | `HKHealthStore.requestAuthorization` | Detect `.sharingDenied` per type; show scoped re-request UI |
| CoreMotion | Step counts, cadence, floors, activity classification | `CMPedometer.startUpdates` / `CMMotionActivityManager.startActivityUpdates` | Provide "Open Settings" CTA when status `.denied` |
| Core Location | Coordinates, geofence events, visits | `CLLocationManager.requestWhenInUseAuthorization` / `requestAlwaysAuthorization` | Leverage `didChangeAuthorization`; show always-onboarding + Settings link |

## Next Steps
- Prototype permission manager module with dependency injection for handlers.
- Implement storage layer abstraction with pluggable Core Data or Realm backend.
- Configure BGTaskScheduler identifiers and ensure Info.plist includes required background modes and usage descriptions.
