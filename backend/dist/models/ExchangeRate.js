import mongoose, { Schema } from 'mongoose';
const ExchangeRateSchema = new Schema({
    id: { type: Number, unique: true },
    currency: { type: String, required: true },
    rate: { type: Number, required: true },
    base: { type: String, required: true },
    flag: { type: String, required: true },
}, {
    collection: 'exchange_rates',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const ExchangeRate = mongoose.model('ExchangeRate', ExchangeRateSchema);
//# sourceMappingURL=ExchangeRate.js.map