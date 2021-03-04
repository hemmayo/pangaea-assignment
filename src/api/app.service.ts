import HttpException from '../exceptions/HttpException';
import { IMessage, ISubscriber, ISubscriberMessage } from '../interfaces';
import subscriberModel from '../models/subscriber.model';
import messageQueueModel from '../models/message-queue.model';
import { addMinutesToDate } from '../utils/util';
import axios from 'axios';
import { logger } from '../utils/logger';
import publishQueueModel from '../models/publish-queue.model';

class AppService {
  public subscriber = subscriberModel;
  public messageQueue = messageQueueModel;
  public publishQueue = publishQueueModel;

  public async addMessageToQueue(topic: string, data: Record<string, any>) {
    const subscribers: ISubscriber[] = await this.subscriber.find({ topic });
    const unpublishedMessages = await this.messageQueue.countDocuments({
      topic,
      data,
      isPublished: false,
      createdAt: { $gte: addMinutesToDate(new Date(), -1) },
    });

    if (!subscribers) {
      throw new HttpException(404, `No subscribers found for this topic`);
    }

    if (unpublishedMessages) {
      // The same message was sent to the messageQueue and hasn't been published in the past one minute (idempotent)
      throw new HttpException(200, `Your message is being published`);
    }

    const message = new this.messageQueue({ topic, data });
    await this.addMessageToSubscribersQueue(message);

    await message.save();
    return { message: 'Message published!' };
  }

  public async addMessageToSubscribersQueue(message) {
    const { _id: messageId, topic }: IMessage = message;
    const subscribers: ISubscriber[] = await this.subscriber.find({ topic });
    const messages: ISubscriberMessage[] = subscribers.map(subscriber => ({ messageId, url: subscriber.url }));

    return this.publishQueue.insertMany(messages);
  }

  public async publishMessages() {
    const publishedMessagesIds = [];
    const limit = 100;

    const queueMessages: ISubscriberMessage[] = await this.publishQueue.find().limit(limit);

    for (const queueMessage of queueMessages) {
      const { url, messageId, _id } = queueMessage;
      const message: IMessage = await this.messageQueue.findById(messageId);

      try {
        await axios.post(url, message.data);
        publishedMessagesIds.push(_id);
      } catch (e) {
        logger.error(`Failed to publish message to ${url}`);
      }

      // Set message status to published
      await this.messageQueue.updateOne({ _id: messageId }, { isPublished: true });
    }

    // Delete published messages from queue
    await this.publishQueue.deleteMany({ _id: publishedMessagesIds });
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
