import { useState } from 'react'
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUsersQuery,
} from '../services/usersApi'

const emptyForm = { name: '', email: '', password: '' }

export default function UsersPage() {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const usersQuery = useUsersQuery()
  const createUser = useCreateUserMutation()
  const updateUser = useUpdateUserMutation()
  const deleteUser = useDeleteUserMutation()

  const users = usersQuery.data ?? []
  const isLoading = usersQuery.isLoading
  const isSaving = createUser.isPending || updateUser.isPending || deleteUser.isPending

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      if (editingId) {
        await updateUser.mutateAsync({ id: editingId, payload: form })
      } else {
        await createUser.mutateAsync(form)
      }
      setForm(emptyForm)
      setEditingId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (user) => {
    setEditingId(user._id)
    setForm({ name: user.name ?? '', email: user.email ?? '', password: '' })
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this editor?')) {
      return
    }
    setError('')
    try {
      await deleteUser.mutateAsync(userId)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="stack">
      <div className="card">
        <div className="card-header">
          <div>
            <h3>{editingId ? 'Edit Editor' : 'Create Editor'}</h3>
            <p className="muted">Admins can create and manage editor accounts only.</p>
          </div>
          {editingId ? (
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(emptyForm)
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              placeholder={editingId ? 'Leave blank to keep current password' : 'Set a password'}
              required={!editingId}
            />
          </label>
          {error ? <div className="alert error full">{error}</div> : null}
          <button className="btn primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingId ? 'Update Editor' : 'Create Editor'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Editors</h3>
            <p className="muted">All editor accounts.</p>
          </div>
        </div>
        {usersQuery.error ? <div className="alert error">{usersQuery.error.message}</div> : null}
        {isLoading ? <div className="muted">Loading editors...</div> : null}
        {users.length === 0 && !isLoading ? <div className="muted">No editors yet.</div> : null}
        <div className="table">
          <div className="table-row table-head cols-4">
            <span>Name</span>
            <span>Email</span>
            <span>Created</span>
            <span>Actions</span>
          </div>
          {users.map((user) => (
            <div key={user._id} className="table-row cols-4">
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              <div className="actions">
                <button className="btn ghost" type="button" onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button className="btn danger" type="button" onClick={() => handleDelete(user._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
