import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'editor'], required: true, default: 'editor' },
    last_login_at: { type: Date, default: null },
  },
  {
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },

    toJSON: {
      transform: (doc, ret) => {
        delete ret._id
        delete ret.__v
        delete ret.password_hash
        return ret
      },
    },
  }
)

export const User = mongoose.model('User', UserSchema)

