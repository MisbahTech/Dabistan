import mongoose, { Schema, Document } from 'mongoose'

export interface ICounter extends Document<string> {
  _id: string
  seq: number
}

const CounterSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  {
    collection: 'counters',
    versionKey: false,
  }
)

export const Counter = mongoose.model<ICounter>('Counter', CounterSchema)
