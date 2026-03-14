import mongoose, { Schema, Document } from 'mongoose'

export interface INavLink extends Document {
  id: number
  nav_key: string
  path: string
  label: string
  sort_order: number
  created_at: Date
  updated_at: Date
}

const NavLinkSchema: Schema = new Schema(
  {
    id: { type: Number, unique: true },
    nav_key: { type: String, required: true, unique: true },
    path: { type: String, required: true },
    label: { type: String, required: true },
    sort_order: { type: Number, default: 0 },
  },
  {
    collection: 'nav_links',
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

export const NavLink = mongoose.model<INavLink>('NavLink', NavLinkSchema)
