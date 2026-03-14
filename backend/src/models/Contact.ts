import mongoose, { Schema, Document } from 'mongoose'

export interface IContact extends Document {
  id: number
  label: string
  href: string
  sort_order: number
  created_at: Date
  updated_at: Date
}

const ContactSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    label: { type: String, required: true },
    href: { type: String, required: true },
    sort_order: { type: Number, default: 0 },
  },
  {
    collection: 'contacts',
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

export const Contact = mongoose.model<IContact>('Contact', ContactSchema)
