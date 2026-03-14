import mongoose, { Schema, Document } from 'mongoose'

export interface IWeather extends Document {
  id: number
  location: string
  temperature: number
  condition: string
  icon: string
  created_at: Date
  updated_at: Date
}

const WeatherSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    location: { type: String, required: true },
    temperature: { type: Number, required: true },
    condition: { type: String, required: true },
    icon: { type: String, required: true },
  },
  {
    collection: 'weather',
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

export const Weather = mongoose.model<IWeather>('Weather', WeatherSchema)
