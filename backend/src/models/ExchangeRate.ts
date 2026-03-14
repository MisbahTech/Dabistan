import mongoose, { Schema, Document } from 'mongoose'

export interface IExchangeRate extends Document {
  id: number
  currency: string
  rate: number
  base: string
  flag: string
  created_at: Date
  updated_at: Date
}

const ExchangeRateSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    currency: { type: String, required: true },
    rate: { type: Number, required: true },
    base: { type: String, required: true },
    flag: { type: String, required: true },
  },
  {
    collection: 'exchange_rates',
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

export const ExchangeRate = mongoose.model<IExchangeRate>('ExchangeRate', ExchangeRateSchema)
