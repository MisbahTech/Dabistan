import mongoose from 'mongoose'

const VideoSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    category: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
    published_at: { type: Date, default: null },
  },
  {
    collection: 'videos',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },

    toJSON: {
      transform: (doc, ret) => {
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

VideoSchema.index({ category: 1, published_at: -1 })

export const Video = mongoose.model('Video', VideoSchema)

