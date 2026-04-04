import mongoose, { Schema } from 'mongoose';
const VideoSchema = new Schema({
    id: { type: Number, unique: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    thumbnail: { type: String, default: null },
    category: { type: String, required: true },
    duration: { type: String, default: null },
    published_at: { type: Date, default: null },
    description: { type: String, default: null },
}, {
    collection: 'videos',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const Video = mongoose.model('Video', VideoSchema);
//# sourceMappingURL=Video.js.map