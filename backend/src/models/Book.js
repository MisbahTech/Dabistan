import mongoose from 'mongoose'

const BookSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
  },
  {
    collection: 'books',
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

export const Book = mongoose.model('Book', BookSchema)
