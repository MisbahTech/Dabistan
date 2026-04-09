import { useState } from 'react'
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useUsersQuery,
} from '../services/usersApi'

import { useRolesQuery } from '../services/rolesApi'

const emptyForm = { name: '', email: '', password: '', role: '' }

export default function UsersPage() {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const usersQuery = useUsersQuery()
  const rolesQuery = useRolesQuery()
  const createUser = useCreateUserMutation()
  const updateUser = useUpdateUserMutation()
  const updateUserPassword = useUpdateUserPasswordMutation()
  const deleteUser = useDeleteUserMutation()

  const users = usersQuery.data?.data ?? (Array.isArray(usersQuery.data) ? usersQuery.data : [])
  const roles = rolesQuery.data?.data ?? (Array.isArray(rolesQuery.data) ? rolesQuery.data : [])
  const isLoading = usersQuery.isLoading || rolesQuery.isLoading
  const isSaving = createUser.isPending || updateUser.isPending || updateUserPassword.isPending || deleteUser.isPending

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      if (editingId) {
        await updateUser.mutateAsync({
          id: editingId,
          payload: {
            name: form.name,
            email: form.email,
            role: form.role,
          },
        })
        if (form.password.trim()) {
          await updateUserPassword.mutateAsync({
            id: editingId,
            payload: { password: form.password },
          })
        }
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
    setEditingId(user.id)
    setForm({
      name: user.name ?? '',
      email: user.email ?? '',
      password: '',
      role: user.role?.slug || user.role || '',
    })
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) {
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
            <h3>{editingId ? 'Edit User' : 'Create User'}</h3>
            <p className="muted">Manage user accounts and their assigned roles.</p>
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
              placeholder={editingId ? 'Enter a new password only if you want to change it' : 'Set a password'}
              required={!editingId}
            />
          </label>
          <label>
            <span>Role</span>
            <select
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
              required
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.slug}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
          {error ? <div className="alert error full">{error}</div> : null}
          <button className="btn primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingId ? 'Update User' : 'Create User'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Users</h3>
            <p className="muted">All system accounts.</p>
          </div>
        </div>
        {usersQuery.error ? <div className="alert error">{usersQuery.error.message}</div> : null}
        {isLoading ? <div className="muted">Loading users...</div> : null}
        {users.length === 0 && !isLoading ? <div className="muted">No users yet.</div> : null}
        <div className="table">
          <div className="table-row table-head cols-5">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Created</span>
            <span>Actions</span>
          </div>
          {users.map((user) => (
            <div key={user.id} className="table-row cols-5">
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span><span className="badge">{user.role?.name || user.role || '-'}</span></span>
              <span>{new Date(user.created_at || user.createdAt).toLocaleDateString()}</span>
              <div className="actions">
                <button className="btn ghost" type="button" onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button className="btn danger" type="button" onClick={() => handleDelete(user.id)}>
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
