import mongoose, { Schema, Document } from 'mongoose'

export interface IPasswordReset extends Document {
  email: string
  otp_hash: string
  expires_at: Date
  consumed_at: Date | null
  created_at: Date
  updated_at: Date
}

const PasswordResetSchema: Schema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otp_hash: { type: String, required: true },
    expires_at: { type: Date, required: true },
    consumed_at: { type: Date, default: null },
  },
  {
    collection: 'password_otps',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

PasswordResetSchema.index({ email: 1, expires_at: -1 })
PasswordResetSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 })

export const PasswordReset = mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema)
