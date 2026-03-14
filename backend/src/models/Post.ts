import mongoose, { Schema, Document } from 'mongoose'

export interface IPost extends Document {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  section_slug: string
  image: string
  author: string
  status: 'draft' | 'published'
  published_at: Date | null
  created_at: Date
  updated_at: Date
}

const PostSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    category: { type: String, default: '' },
    section_slug: { type: String, required: true },
    image: { type: String, default: '' },
    author: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    published_at: { type: Date, default: null },
  },
  {
    collection: 'posts',
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

PostSchema.index({ status: 1, published_at: -1 })
PostSchema.index({ category: 1 })
PostSchema.index({ section_slug: 1 })

export const Post = mongoose.model<IPost>('Post', PostSchema)
