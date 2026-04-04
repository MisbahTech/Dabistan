import mongoose, { Schema } from 'mongoose';
const CategorySchema = new Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
}, {
    collection: 'categories',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const Category = mongoose.model('Category', CategorySchema);
//# sourceMappingURL=Category.js.map