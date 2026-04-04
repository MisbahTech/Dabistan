import mongoose, { Schema } from 'mongoose';
const WeatherSchema = new Schema({
    id: { type: Number, unique: true },
    location: { type: String, required: true },
    temperature: { type: Number, required: true },
    condition: { type: String, required: true },
    icon: { type: String, required: true },
}, {
    collection: 'weather',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const Weather = mongoose.model('Weather', WeatherSchema);
//# sourceMappingURL=Weather.js.map