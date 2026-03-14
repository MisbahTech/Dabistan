import mongoose, { Schema, Document } from 'mongoose'

export interface IPermission extends Document {
  id: number
  name: string
  slug: string
  description?: string
  created_at: Date
  updated_at: Date
}

const PermissionSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
  },
  {
    collection: 'permissions',
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

export const Permission = mongoose.model<IPermission>('Permission', PermissionSchema)
