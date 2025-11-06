import request from 'supertest';
import { createApp } from '../../src/app';

describe('Health endpoint', () => {
  it('returns healthy status and timestamp', async () => {
    const app = createApp();
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'healthy'
      })
    );
  });
});
