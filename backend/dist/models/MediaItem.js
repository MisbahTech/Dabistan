import mongoose, { Schema } from 'mongoose';
const MediaItemSchema = new Schema({
    id: { type: Number, unique: true },
    section_slug: { type: String, required: true },
    media_type: { type: String, enum: ['image', 'video'], required: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, default: null },
    duration: { type: String, default: null },
    text: { type: String, default: null },
}, {
    collection: 'media_items',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const MediaItem = mongoose.model('MediaItem', MediaItemSchema);
//# sourceMappingURL=MediaItem.js.map