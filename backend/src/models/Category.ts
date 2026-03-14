import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  id: number
  name: string
  slug: string
  description: string
  created_at: Date
  updated_at: Date
}

const CategorySchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
  },
  {
    collection: 'categories',
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

export const Category = mongoose.model<ICategory>('Category', CategorySchema)
