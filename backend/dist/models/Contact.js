import mongoose, { Schema } from 'mongoose';
const ContactSchema = new Schema({
    id: { type: Number, unique: true },
    label: { type: String, required: true },
    href: { type: String, required: true },
    sort_order: { type: Number, default: 0 },
}, {
    collection: 'contacts',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const Contact = mongoose.model('Contact', ContactSchema);
//# sourceMappingURL=Contact.js.map