import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    href: { type: String, required: true },
    sort_order: { type: Number, default: 0 },
  },
  {
    collection: 'contacts',
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

export const Contact = mongoose.model('Contact', ContactSchema)
