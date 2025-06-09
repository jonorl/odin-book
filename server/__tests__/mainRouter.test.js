import request from 'supertest'
import app from '../app.js'

describe('Main Router', () => {

  it('GET /api/v1/test/ should return a 200 code', async () => {
    const response = await request(app)
      .get('/api/v1/test/');

    expect(response.statusCode).toBe(200);
  });

  it('GET /api/v1/test/ should return 10 users', async () => {
    const response = await request(app)
      .get('/api/v1/test/');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.users)).toBe(true);
    expect(response.body.users.length).toBe(10);
  });
});