export interface ISubscriber {
  _id?: string;
  url: string;
  topic: string;
}

export interface IPublishMessage {
  _id?: string;
  topic: string;
  data: Record<string, any>;
}
