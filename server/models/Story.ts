import mongoose, { Document, Schema } from 'mongoose';

export interface IStory extends Document {
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    projectId: string;
    createdAt: string;
    status: 'todo' | 'doing' | 'done';
    ownerId: string;
}

const StorySchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, required: true },
    projectId: { type: String, ref: 'Project', required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, required: true },
    ownerId: { type: String, ref: 'User', required: true },
});

export const Story = mongoose.model<IStory>('Story', StorySchema);
