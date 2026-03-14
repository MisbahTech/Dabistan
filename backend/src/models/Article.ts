import mongoose, { Schema, Document } from 'mongoose'

export interface IArticle extends Document {
  id: number
  section_slug: string
  title: string
  excerpt: string | null
  href: string
  created_at: Date
  updated_at: Date
}

const ArticleSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    section_slug: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: null },
    href: { type: String, required: true },
  },
  {
    collection: 'articles',
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

export const Article = mongoose.model<IArticle>('Article', ArticleSchema)
