import mongoose, { Schema, Document } from 'mongoose'

export interface IUpload extends Document {
  id: number
  filename: string
  original_name: string
  mime_type: string
  size: number
  path: string
  uploaded_by: string
  created_at: Date
  updated_at: Date
}

const UploadSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    filename: { type: String, required: true },
    original_name: { type: String, required: true },
    mime_type: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    uploaded_by: { type: String, default: 'anonymous' },
  },
  {
    collection: 'uploads',
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

export const Upload = mongoose.model<IUpload>('Upload', UploadSchema)
