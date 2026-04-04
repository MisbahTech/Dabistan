import mongoose, { Schema } from 'mongoose';
const NavLinkSchema = new Schema({
    id: { type: Number, unique: true },
    nav_key: { type: String, required: true, unique: true },
    path: { type: String, required: true },
    label: { type: String, required: true },
    sort_order: { type: Number, default: 0 },
}, {
    collection: 'nav_links',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const NavLink = mongoose.model('NavLink', NavLinkSchema);
//# sourceMappingURL=NavLink.js.map