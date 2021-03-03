import { NextFunction, Request, Response } from 'express';
import { CreateSubscriberDto } from './app.dto';
import { IPublishMessage, ISubscriber } from '../interfaces';
import appService from './app.service';

class AppController {
  public appService = new appService();

  public addMessageToQueue = async (req: Request, res: Response, next: NextFunction) => {
    const payload: any = req.body;
    const topic = req.params.topic;

    try {
      const response = await this.appService.addMessageToQueue(topic, payload);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getSubscribers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscribers: ISubscriber[] = await this.appService.findAll();
      res.status(200).json(subscribers);
    } catch (error) {
      next(error);
    }
  };

  public createSubscriber = async (req: Request, res: Response, next: NextFunction) => {
    const { url }: CreateSubscriberDto = req.body;
    const topic = req.params.topic;

    try {
      const subscriber: ISubscriber = await this.appService.createSubscriber(topic, url);
      res.status(201).json(subscriber);
    } catch (error) {
      next(error);
    }
  };

  public deleteSubscriber = async (req: Request, res: Response, next: NextFunction) => {
    const subscriberId: string = req.params.id;

    try {
      const subscriber: ISubscriber = await this.appService.deleteSubscriber(subscriberId);
      res.status(200).json({ data: subscriber, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default AppController;
