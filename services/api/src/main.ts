import http from 'http';
import { createApp } from './app';

const PORT = Number(process.env.PORT ?? 4000);
const API_PREFIX = process.env.API_PREFIX ?? '/api';

async function bootstrap() {
  const app = createApp({ apiPrefix: API_PREFIX });
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start API server', error);
  process.exit(1);
});
