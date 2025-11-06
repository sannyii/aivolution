import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

export interface AppConfig {
  apiPrefix?: string;
}

export function createApp(config: AppConfig = {}): Application {
  const app = express();
  const prefix = config.apiPrefix ?? '/api';

  app.use(express.json());
  app.use(cors());
  app.use(helmet());

  app.get('/', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get(`${prefix}/health`, (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  });

  return app;
}
