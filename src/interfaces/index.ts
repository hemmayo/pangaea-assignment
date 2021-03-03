export interface ISubscriber {
  url: string;
  topic: string;
}

export interface IPublishMessage {
  topic: string;
  data: Record<string, any>;
}
