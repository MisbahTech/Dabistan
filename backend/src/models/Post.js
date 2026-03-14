import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    category: { type: String, default: '' },
    image: { type: String, default: '' },
    author: { type: String, required: true }, // Existing code seems to use string format in repo but reference is likely needed
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    published_at: { type: Date, default: null },
  },
  {
    collection: 'posts',
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

PostSchema.index({ status: 1, published_at: -1 })
PostSchema.index({ category: 1 })

export const Post = mongoose.model('Post', PostSchema)

