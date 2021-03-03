import { model, Schema, Document, Types } from 'mongoose';
import { ISubscriberMessage } from '../interfaces';

const publishQueueSchema: Schema = new Schema(
  {
    messageId: { type: Types.ObjectId, required: true, ref: 'MessageQueue' },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const publishQueueModel = model<ISubscriberMessage & Document>('PublishQueue', publishQueueSchema);

export default publishQueueModel;
