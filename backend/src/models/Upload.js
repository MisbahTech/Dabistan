import mongoose from 'mongoose'

const UploadSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    uploadedBy: { type: String, required: true }, // Aligning with other models using string for author/user for now
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

export const Upload = mongoose.model('Upload', UploadSchema)

