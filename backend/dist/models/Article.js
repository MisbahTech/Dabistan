import mongoose, { Schema } from 'mongoose';
const ArticleSchema = new Schema({
    id: { type: Number, unique: true },
    section_slug: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: null },
    href: { type: String, required: true },
}, {
    collection: 'articles',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const Article = mongoose.model('Article', ArticleSchema);
//# sourceMappingURL=Article.js.map