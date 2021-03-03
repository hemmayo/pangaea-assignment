import { model, Schema, Document } from 'mongoose';
import { ISubscriber } from '../interfaces';

const subscriberSchema: Schema = new Schema({
  url: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
});

const subscriberModel = model<ISubscriber & Document>('Subscriber', subscriberSchema);

export default subscriberModel;
