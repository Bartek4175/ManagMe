import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  storyId: string;
  projectId: string;
  estimatedTime: number;
  status: 'todo' | 'doing' | 'done';
  createdAt: string;
  startDate: string;
  endDate: string;
  userId?: string;
  assigneeId?: string;
}

const TaskSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, required: true },
  storyId: { type: String, required: true },
  projectId: { type: String, required: true },
  estimatedTime: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: String, required: true },
  startDate: { type: String },
  endDate: { type: String },
  userId: { type: String},
  assigneeId: { type: String },
});

export const Task = mongoose.model<ITask>('Task', TaskSchema);
