import mongoose from 'mongoose'

const MediaItemSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    section_slug: { type: String, required: true, index: true },
    media_type: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, default: null },
    duration: { type: String, default: null },
    text: { type: String, default: null },
  },
  {
    collection: 'media_items',
    timestamps: { createdAt: 'created_at', updatedAt: null }, // Existing code only set created_at
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

export const MediaItem = mongoose.model('MediaItem', MediaItemSchema)
