import mongoose, { Schema } from 'mongoose';
const LinkSchema = new Schema({
    id: { type: Number, unique: true },
    section_slug: { type: String, required: true },
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true },
}, {
    collection: 'links',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const Link = mongoose.model('Link', LinkSchema);
//# sourceMappingURL=Link.js.map