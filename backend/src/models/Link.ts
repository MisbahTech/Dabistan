import mongoose, { Schema, Document } from 'mongoose'

export interface ILink extends Document {
  id: number
  section_slug: string
  label: string
  href: string
  created_at: Date
  updated_at: Date
}

const LinkSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    section_slug: { type: String, required: true },
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true },
  },
  {
    collection: 'links',
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

export const Link = mongoose.model<ILink>('Link', LinkSchema)
