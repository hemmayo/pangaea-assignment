import mongoose from 'mongoose';
import request from 'supertest';
import App from '../app';
import AppRoute from '../api/app.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Subscribers', () => {
  describe('GET /subscribers', () => {
    it('response All Subscribers', () => {
      const appRoute = new AppRoute();
      appRoute.appController.appService.subscriber.find = jest.fn().mockReturnValue(
        Promise.resolve([
          {
            url: 'http://localhost:3001',
            topic: 'food',
          },
        ]),
      );

      (mongoose as any).connect = jest.fn();
      const app = new App([appRoute]);
      return request(app.getServer()).get(`${appRoute.path}`).expect(200);
    });
  });
});
