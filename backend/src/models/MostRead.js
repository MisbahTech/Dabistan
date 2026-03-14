import mongoose from 'mongoose'

const MostReadSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    category: { type: String, default: '' },
    rank: { type: Number, default: 0 },
    published_at: { type: Date, default: null },
  },
  {
    collection: 'most_read',
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

MostReadSchema.index({ rank: 1 })

export const MostRead = mongoose.model('MostRead', MostReadSchema)

