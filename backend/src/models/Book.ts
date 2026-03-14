import mongoose, { Schema, Document } from 'mongoose'

export interface IBook extends Document {
  id: number
  slug: string
  title: string
  description: string
  created_at: Date
  updated_at: Date
}

const BookSchema: Schema = new Schema(
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
      transform: (_doc, ret: any) => {
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

export const Book = mongoose.model<IBook>('Book', BookSchema)
