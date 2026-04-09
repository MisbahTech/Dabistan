import mongoose, { Schema } from 'mongoose';
const PostSchema = new Schema({
    id: { type: Number, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    category: { type: String, default: '' },
    section_slug: { type: String, required: true },
    image: { type: String, default: '' },
    gallery: [{ type: String, default: '' }],
    attachment: {
        type: new Schema({
            url: { type: String, required: true },
            name: { type: String, default: '' },
            originalName: { type: String, default: '' },
            size: { type: Number, default: 0 },
            mimetype: { type: String, default: '' },
        }, { _id: false }),
        default: null,
    },
    author: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    view_count: { type: Number, default: 0 },
    published_at: { type: Date, default: null },
}, {
    collection: 'posts',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
PostSchema.index({ status: 1, published_at: -1 });
PostSchema.index({ category: 1 });
PostSchema.index({ section_slug: 1 });
export const Post = mongoose.model('Post', PostSchema);
//# sourceMappingURL=Post.js.map