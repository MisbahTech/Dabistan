import mongoose from 'mongoose'

const WeatherSchema = new mongoose.Schema(
  {
    location: { type: String, required: true, trim: true },
    temperature: { type: Number, required: true },
    condition: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

export const Weather = mongoose.model('Weather', WeatherSchema)
