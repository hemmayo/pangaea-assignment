export interface ISubscriber {
  _id?: string;
  url: string;
  topic: string;
}

export interface IMessage {
  _id?: string;
  topic: string;
  data: Record<string, any>;
  createdAt?: Date;
  isPublished?: boolean;
}

export interface ISubscriberMessage {
  _id?: string;
  messageId: string;
  url: string;
}
