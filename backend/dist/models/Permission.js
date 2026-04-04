import mongoose, { Schema } from 'mongoose';
const PermissionSchema = new Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
}, {
    collection: 'permissions',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const Permission = mongoose.model('Permission', PermissionSchema);
//# sourceMappingURL=Permission.js.map