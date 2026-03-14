import mongoose from 'mongoose'

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    category: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

VideoSchema.index({ category: 1, publishedAt: -1 })

export const Video = mongoose.model('Video', VideoSchema)
