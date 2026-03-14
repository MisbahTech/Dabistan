import mongoose, { Schema, Document } from 'mongoose'
import { IRole } from './Role.js'

export interface IUser extends Document {
  id: number
  name: string
  email: string
  password_hash: string
  role: Schema.Types.ObjectId | IRole | string
  last_login_at: Date | null
  created_at: Date
  updated_at: Date
}

const UserSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true, select: false },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    last_login_at: { type: Date, default: null },
  },
  {
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret._id
        delete ret.__v
        delete ret.password_hash
        return ret
      },
    },
  }
)

export const User = mongoose.model<IUser>('User', UserSchema)
