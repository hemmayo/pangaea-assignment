import { model, Schema, Document } from 'mongoose';

const queueSchema: Schema = new Schema(
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

const queueModel = model<Document>('Queue', queueSchema);

export default queueModel;
