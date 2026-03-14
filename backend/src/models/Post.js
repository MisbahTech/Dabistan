import mongoose from 'mongoose'

const AttachmentSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
  },
  { _id: false }
)

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    category: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    attachment: { type: AttachmentSchema, default: null },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

PostSchema.index({ status: 1, publishedAt: -1 })
PostSchema.index({ category: 1 })

export const Post = mongoose.model('Post', PostSchema)
