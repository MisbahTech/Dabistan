import mongoose, { Schema, Document } from 'mongoose'

export interface ISection extends Document {
  id: number
  slug: string
  title: string
  description: string
  created_at: Date
  updated_at: Date
}

const SectionSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
  },
  {
    collection: 'sections',
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

export const Section = mongoose.model<ISection>('Section', SectionSchema)
