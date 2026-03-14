import mongoose from 'mongoose'

const ExchangeRateSchema = new mongoose.Schema(
  {
    base: { type: String, required: true, trim: true },
    currency: { type: String, required: true, trim: true },
    rate: { type: Number, required: true },
  },
  { timestamps: true }
)

ExchangeRateSchema.index({ currency: 1 })

export const ExchangeRate = mongoose.model('ExchangeRate', ExchangeRateSchema)
