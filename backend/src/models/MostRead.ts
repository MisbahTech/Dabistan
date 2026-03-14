import mongoose, { Schema, Document } from 'mongoose'

export interface IMostRead extends Document {
  id: number
  title: string
  slug: string
  rank: number
  published_at: Date | null
  created_at: Date
  updated_at: Date
}

const MostReadSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    rank: { type: Number, required: true },
    published_at: { type: Date, default: null },
  },
  {
    collection: 'most_read',
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

export const MostRead = mongoose.model<IMostRead>('MostRead', MostReadSchema)
