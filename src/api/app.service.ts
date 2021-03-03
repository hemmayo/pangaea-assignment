import HttpException from '../exceptions/HttpException';
import { IPublishMessage, ISubscriber } from '../interfaces';
import subscriberModel from '../models/subscriber.model';
import queueModel from '../models/queue.model';
import { addMinutesToDate } from '../utils/util';
import axios from 'axios';
import { logger } from '../utils/logger';

class AppService {
  public subscriber = subscriberModel;
  public queue = queueModel;

  public async addMessageToQueue(topic: string, data: string) {
    const subscribers: ISubscriber[] = await this.subscriber.find({ topic });
    const unpublishedMessages = await this.queue.find({
      topic,
      data,
      isPublished: false,
      createdAt: { $gte: addMinutesToDate(new Date(), -1) },
    });

    if (!subscribers) {
      throw new HttpException(404, `No subscribers found for this topic`);
    }

    if (unpublishedMessages.length) {
      // The same message was sent to the queue and hasn't been published in the past one minute (idempotent)
      throw new HttpException(200, `Your message is being published`);
    }

    await this.queue.create({ topic, data });

    return { message: 'Message published!' };
  }

  public async publishMessages() {
    const limit = 50;
    let messagesReceived;

    const messages: IPublishMessage[] = await this.queue.find({ isPublished: false }).limit(limit).lean();

    for (const message of messages) {
      const { topic, data, _id } = message;
      const subscribers: ISubscriber[] = await this.findAll({ topic });
      messagesReceived = 0;

      if (subscribers.length) {
        for (const subscriber of subscribers) {
          const { url } = subscriber;

          try {
            await axios.post(url, data);
            messagesReceived++;
          } catch (e) {
            logger.error(`Failed to publish message to ${url}`);
          }
        }
      }

      if (messagesReceived > 0) {
        // Set message status to published
        await this.queue.updateOne({ _id }, { isPublished: true });
      }
    }
  }

  public async findAll(criteria = {}): Promise<ISubscriber[]> {
    const subscribers: ISubscriber[] = await this.subscriber.find(criteria).select('topic url _id');
    return subscribers;
  }

  public async createSubscriber(topic: string, url: string): Promise<ISubscriber> {
    const subscriber: ISubscriber = await this.subscriber.findOne({ topic, url });
    if (subscriber) throw new HttpException(409, `This subscriber already exists`);

    const createdSubscriber: ISubscriber = await this.subscriber.create({ topic, url });
    return { topic: createdSubscriber.topic, url: createdSubscriber.url };
  }

  public async deleteSubscriber(subscriberId: string): Promise<ISubscriber> {
    const deleteSubscriberById: ISubscriber = await this.subscriber.findByIdAndDelete(subscriberId);
    if (!deleteSubscriberById) throw new HttpException(409, 'Subscriber not found');

    return deleteSubscriberById;
  }
}

export default AppService;
