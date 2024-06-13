import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  login: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: string;
}

const UserSchema: Schema = new Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: true, default: 'developer' }
});

export const User = mongoose.model<IUser>('User', UserSchema);