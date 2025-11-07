# AIVolution API Service

A TypeScript-based Express service that powers the AIVolution platform. The service exposes RESTful endpoints and is designed to run on AWS Fargate or other container platforms.

## Features

- ⚙️ Express server with security middleware (Helmet) and CORS
- 🧪 Jest-powered unit and integration testing with Supertest
- 🧵 Ready-to-use TypeScript configuration and build pipeline
- ☁️ Cloud-friendly structure with environment-driven configuration

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with auto-reload |
| `npm run build` | Compile TypeScript sources to `dist/` |
| `npm run start` | Run the compiled server |
| `npm run test` | Execute unit tests |
| `npm run test:integration` | Execute integration tests |
| `npm run lint` | Lint the source code |

## Local Development

```bash
cd services/api
npm install
npm run dev
```

The API listens on port `4000` by default. Override the port and the API prefix with environment variables:

```bash
PORT=8080 API_PREFIX=/internal npm run dev
```

## Deployment

The service is ready for containerization. Build the project and bundle it with your favourite tool:

```bash
npm run build
```

The generated `dist/` directory can be copied into a Node.js runtime image. For production, remember to provide environment variables for the port, logging, database URIs, and other secrets via AWS Systems Manager Parameter Store or Secrets Manager.
