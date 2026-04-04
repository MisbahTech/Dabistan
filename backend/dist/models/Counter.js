import mongoose, { Schema } from 'mongoose';
const CounterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
}, {
    collection: 'counters',
    versionKey: false,
});
export const Counter = mongoose.model('Counter', CounterSchema);
//# sourceMappingURL=Counter.js.map