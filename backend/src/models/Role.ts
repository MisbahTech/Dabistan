import mongoose, { Schema, Document } from 'mongoose'

export interface IRole extends Document {
  id: number
  name: string
  slug: string
  permissions: mongoose.Types.ObjectId[]
  created_at: Date
  updated_at: Date
}

const RoleSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
  },
  {
    collection: 'roles',
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

export const Role = mongoose.model<IRole>('Role', RoleSchema)
