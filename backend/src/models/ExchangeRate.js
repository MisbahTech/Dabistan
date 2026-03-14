import mongoose from 'mongoose'

const ExchangeRateSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    base: { type: String, required: true, trim: true },
    currency: { type: String, required: true, trim: true },
    rate: { type: Number, required: true },
  },
  {
    collection: 'exchange_rates',
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

ExchangeRateSchema.index({ currency: 1 })

export const ExchangeRate = mongoose.model('ExchangeRate', ExchangeRateSchema)

