import { Router } from 'express';
import AppController from './app.controller';
import { CreateSubscriberDto } from './app.dto';
import Route from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';

class AppRoute implements Route {
  public path = '';
  public router = Router();
  public appController = new AppController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/subscribers`, this.appController.getSubscribers);
    this.router.post(`${this.path}/subscribe/:topic`, validationMiddleware(CreateSubscriberDto, 'body'), this.appController.createSubscriber);
    this.router.delete(`${this.path}/:id`, this.appController.deleteSubscriber);
    this.router.post(`${this.path}/publish/:topic`, this.appController.addMessageToQueue);
  }
}

export default AppRoute;
