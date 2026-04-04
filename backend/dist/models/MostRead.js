import mongoose, { Schema } from 'mongoose';
const MostReadSchema = new Schema({
    id: { type: Number, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    rank: { type: Number, required: true },
    published_at: { type: Date, default: null },
}, {
    collection: 'most_read',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const MostRead = mongoose.model('MostRead', MostReadSchema);
//# sourceMappingURL=MostRead.js.map