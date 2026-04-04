import mongoose, { Schema } from 'mongoose';
const RoleSchema = new Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
}, {
    collection: 'roles',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const Role = mongoose.model('Role', RoleSchema);
//# sourceMappingURL=Role.js.map