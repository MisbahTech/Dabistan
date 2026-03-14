import { useState } from 'react'
import {
  useRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '../services/rolesApi'

const emptyForm = { name: '', slug: '', permissions: '' }

export default function RolesPage() {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const rolesQuery = useRolesQuery()
  const createRole = useCreateRoleMutation()
  const updateRole = useUpdateRoleMutation()
  const deleteRole = useDeleteRoleMutation()

  const roles = rolesQuery.data?.data ?? rolesQuery.data ?? []
  const isLoading = rolesQuery.isLoading
  const isSaving = createRole.isPending || updateRole.isPending || deleteRole.isPending

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        permissions: form.permissions.split(',').map((p) => p.trim()).filter(Boolean),
      }

      if (editingId) {
        await updateRole.mutateAsync({ id: editingId, payload })
      } else {
        await createRole.mutateAsync(payload)
      }
      setForm(emptyForm)
      setEditingId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (role) => {
    setEditingId(role.id)
    setForm({
      name: role.name || '',
      slug: role.slug || '',
      permissions: Array.isArray(role.permissions) ? role.permissions.join(', ') : '',
    })
  }

  const handleDelete = async (roleId) => {
    if (!window.confirm('Delete this role?')) {
      return
    }
    setError('')
    try {
      await deleteRole.mutateAsync(roleId)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="stack">
      <div className="card">
        <div className="card-header">
          <div>
            <h3>{editingId ? 'Edit Role' : 'Create Role'}</h3>
            <p className="muted">Define system roles and their associated permissions.</p>
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
            <span>Role Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="e.g. Content Manager"
              required
            />
          </label>
          <label>
            <span>Slug</span>
            <input
              type="text"
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value.toLowerCase().replace(/\s+/g, '-') }))}
              placeholder="e.g. content-manager"
              required
            />
          </label>
          <label className="full">
            <span>Permissions (comma separated)</span>
            <textarea
              value={form.permissions}
              onChange={(event) => setForm((prev) => ({ ...prev, permissions: event.target.value }))}
              placeholder="e.g. post.create, post.edit, category.manage"
              rows={2}
            />
          </label>
          {error ? <div className="alert error full">{error}</div> : null}
          <button className="btn primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingId ? 'Update Role' : 'Create Role'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Current Roles</h3>
            <p className="muted">Managed roles currently in the system.</p>
          </div>
        </div>
        {rolesQuery.error ? <div className="alert error">{rolesQuery.error.message}</div> : null}
        {isLoading ? <div className="muted">Loading roles...</div> : null}
        {!isLoading && roles.length === 0 ? <div className="muted">No roles found.</div> : null}
        <div className="table">
          <div className="table-row table-head cols-4">
            <span>Name</span>
            <span>Slug</span>
            <span>Permissions</span>
            <span>Actions</span>
          </div>
          {roles.map((role) => (
            <div key={role.id} className="table-row cols-4">
              <span>{role.name}</span>
              <span><code className="badge">{role.slug}</code></span>
              <span className="truncate">{role.permissions?.join(', ') || 'None'}</span>
              <div className="actions">
                <button className="btn ghost" type="button" onClick={() => handleEdit(role)}>
                  Edit
                </button>
                {role.slug !== 'admin' && (
                  <button className="btn danger" type="button" onClick={() => handleDelete(role.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
