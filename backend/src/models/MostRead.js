import mongoose from 'mongoose'

const MostReadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    category: { type: String, default: '' },
    rank: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

MostReadSchema.index({ rank: 1 })

export const MostRead = mongoose.model('MostRead', MostReadSchema)
