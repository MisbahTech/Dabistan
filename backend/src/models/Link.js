import mongoose from 'mongoose'

const LinkSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    section_slug: { type: String, required: true, index: true },
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  {
    collection: 'links',
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

export const Link = mongoose.model('Link', LinkSchema)
