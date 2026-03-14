import mongoose from 'mongoose'

const ArticleSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    section_slug: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: '' },
    href: { type: String, required: true },
  },
  {
    collection: 'articles',
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

export const Article = mongoose.model('Article', ArticleSchema)
