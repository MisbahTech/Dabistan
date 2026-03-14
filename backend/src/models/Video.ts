import mongoose, { Schema, Document } from 'mongoose'

export interface IVideo extends Document {
  id: number
  title: string
  url: string
  thumbnail?: string | null
  category: string
  duration?: string | null
  published_at?: Date | null
  description?: string | null
  created_at: Date
  updated_at: Date
}

const VideoSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    thumbnail: { type: String, default: null },
    category: { type: String, required: true },
    duration: { type: String, default: null },
    published_at: { type: Date, default: null },
    description: { type: String, default: null },
  },
  {
    collection: 'videos',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

export const Video = mongoose.model<IVideo>('Video', VideoSchema)
