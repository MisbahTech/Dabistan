import mongoose, { Schema, Document } from 'mongoose'

export interface IMediaItem extends Document {
  id: number
  section_slug: string
  media_type: 'image' | 'video'
  title: string
  url: string | null
  duration: string | null
  text: string | null
  created_at: Date
  updated_at: Date
}

const MediaItemSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    section_slug: { type: String, required: true },
    media_type: { type: String, enum: ['image', 'video'], required: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, default: null },
    duration: { type: String, default: null },
    text: { type: String, default: null },
  },
  {
    collection: 'media_items',
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

export const MediaItem = mongoose.model<IMediaItem>('MediaItem', MediaItemSchema)
