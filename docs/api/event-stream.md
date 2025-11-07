# Real-time Event Stream Specification

The API Gateway exposes a WebSocket endpoint that streams real-time events related to projects, assets, and AI/3D inference jobs.

- **Endpoint:** `wss://api.aivolution.example.com/v1/ws`
- **Subprotocol:** `json.stream`
- **Authentication:** Clients must include a valid JWT access token in the `Authorization: Bearer <token>` header during the WebSocket handshake.
- **Encoding:** UTF-8 JSON messages, newline delimited.

## Connection Lifecycle

1. Client opens a WebSocket connection using the endpoint and includes the `Authorization` header.
2. Upon successful authentication, the server emits a `connection_ack` event.
3. Client may send `subscribe` messages to express interest in specific projects or job updates.
4. Server streams events matching active subscriptions until the client sends an `unsubscribe` message or closes the connection.

## Message Formats

All messages are JSON objects with a `type` field. Additional fields depend on message type.

### Server-to-Client Events

| Type | Description | Payload |
| --- | --- | --- |
| `connection_ack` | Sent after successful authentication. | `{ "type": "connection_ack", "connectionId": "uuid" }` |
| `project.updated` | Notifies about project metadata changes. | `{ "type": "project.updated", "project": <Project> }` |
| `asset.created` | Emitted when a new asset is ingested or generated. | `{ "type": "asset.created", "asset": <Asset> }` |
| `job.progress` | Periodic progress updates for running jobs. | `{ "type": "job.progress", "jobId": "uuid", "progress": 0-100 }` |
| `job.completed` | Job finished successfully. | `{ "type": "job.completed", "job": <InferenceJob> }` |
| `job.failed` | Job failed with error info. | `{ "type": "job.failed", "jobId": "uuid", "error": "string" }` |
| `error` | Indicates protocol or authorization issues. | `{ "type": "error", "code": "string", "message": "string" }` |

### Client-to-Server Messages

| Type | Description | Example |
| --- | --- | --- |
| `ping` | Keepalive signal. | `{ "type": "ping" }` |
| `subscribe` | Subscribe to event topics. | `{ "type": "subscribe", "topics": ["project:{projectId}", "job:{jobId}"] }` |
| `unsubscribe` | Remove subscriptions. | `{ "type": "unsubscribe", "topics": ["job:{jobId}"] }` |
| `ack` | Acknowledge receipt for at-least-once delivery. | `{ "type": "ack", "eventId": "uuid" }` |

## Data Shapes

The `Project`, `Asset`, and `InferenceJob` structures mirror the REST models defined in [`openapi.yaml`](./openapi.yaml). Event payloads use the same field names and types, ensuring consistency across synchronous and asynchronous interfaces.

## Delivery Semantics

- Messages are delivered in order per topic.
- The server retries undelivered events up to 3 times if it does not receive an `ack` within 10 seconds. After the retries, the server sends an `error` message with code `ack_timeout` and may close the connection.
- Heartbeat `ping`/`pong` frames are exchanged every 30 seconds. Clients should respond with a `pong` frame or `ping` message.

## Error Codes

| Code | Meaning | Recommended Client Action |
| --- | --- | --- |
| `unauthorized` | Invalid or expired token. | Refresh token and reconnect. |
| `invalid_message` | Payload could not be parsed or failed validation. | Fix message format and retry. |
| `subscription_limit` | Client exceeded allowed subscriptions per connection. | Reduce topics and resend subscription. |
| `ack_timeout` | Client failed to acknowledge after retries. | Reconnect and resubscribe. |
