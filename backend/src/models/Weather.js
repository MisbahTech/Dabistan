import mongoose from 'mongoose'

const WeatherSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    location: { type: String, required: true, trim: true },
    temperature: { type: Number, required: true },
    condition: { type: String, required: true, trim: true },
  },
  {
    collection: 'weather',
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

export const Weather = mongoose.model('Weather', WeatherSchema)

