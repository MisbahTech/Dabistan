import mongoose, { Schema } from 'mongoose';
const UploadSchema = new Schema({
    id: { type: Number, unique: true },
    filename: { type: String, required: true },
    original_name: { type: String, required: true },
    mime_type: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    uploaded_by: { type: String, default: 'anonymous' },
}, {
    collection: 'uploads',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const Upload = mongoose.model('Upload', UploadSchema);
//# sourceMappingURL=Upload.js.map