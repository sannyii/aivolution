import request from 'supertest';
import { createApp } from '../../src/app';

describe('App configuration', () => {
  it('responds with ok for the root route', async () => {
    const app = createApp();
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('uses the configured prefix for the health endpoint', async () => {
    const app = createApp({ apiPrefix: '/internal' });
    const response = await request(app).get('/internal/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.timestamp).toBeDefined();
  });
});
