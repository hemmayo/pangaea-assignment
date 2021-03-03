import { model, Schema, Document } from 'mongoose';
import { IMessage } from '../interfaces';

const messageQueueSchema: Schema = new Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const messageQueueModel = model<IMessage & Document>('MessageQueue', messageQueueSchema);

export default messageQueueModel;
