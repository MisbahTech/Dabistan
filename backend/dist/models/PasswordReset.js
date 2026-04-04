import mongoose, { Schema } from 'mongoose';
const PasswordResetSchema = new Schema({
    email: { type: String, required: true, lowercase: true, trim: true },
    otp_hash: { type: String, required: true },
    expires_at: { type: Date, required: true },
    consumed_at: { type: Date, default: null },
}, {
    collection: 'password_otps',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
PasswordResetSchema.index({ email: 1, expires_at: -1 });
PasswordResetSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
export const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema);
//# sourceMappingURL=PasswordReset.js.map