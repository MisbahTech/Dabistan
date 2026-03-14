import { useState } from 'react'
import {
  usePermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation
} from '../services/permissionsApi'
import { 
  Shield, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  AlertCircle,
  Key
} from 'lucide-react'

const PermissionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  })

  const { data: permissionsData, isLoading, error } = usePermissionsQuery({ q: searchTerm })
  const createMutation = useCreatePermissionMutation()
  const updateMutation = useUpdatePermissionMutation()
  const deleteMutation = useDeletePermissionMutation()

  const handleOpenForm = (permission = null) => {
    if (permission) {
      setEditingPermission(permission)
      setFormData({
        name: permission.name,
        slug: permission.slug,
        description: permission.description || ''
      })
    } else {
      setEditingPermission(null)
      setFormData({ name: '', slug: '', description: '' })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingPermission(null)
    setFormData({ name: '', slug: '', description: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPermission) {
        await updateMutation.mutateAsync({ id: editingPermission.id, ...formData })
      } else {
        await createMutation.mutateAsync(formData)
      }
      handleCloseForm()
    } catch (err) {
      console.error('Failed to save permission:', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this permission? This might affect roles assigned to it.')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (err) {
        console.error('Failed to delete permission:', err)
      }
    }
  }

  return (
    <section className="stack">
      <div className="card">
        <div className="card-header">
          <div>
            <h3>{editingPermission ? 'Edit Permission' : 'Create Permission'}</h3>
            <p className="muted">Define and manage system-wide granular permissions.</p>
          </div>
          {isFormOpen || editingPermission ? (
            <button
              className="btn ghost"
              type="button"
              onClick={handleCloseForm}
            >
              Cancel
            </button>
          ) : (
            <button
              className="btn primary"
              type="button"
              onClick={() => handleOpenForm()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Permission
            </button>
          )}
        </div>

        {(isFormOpen || editingPermission) && (
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              <span>Permission Name</span>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Manage Content"
              />
            </label>
            <label>
              <span>Permission Slug (Unique ID)</span>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '.') })}
                placeholder="e.g., content.manage"
              />
              <p className="muted" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Used in code to check permissions.</p>
            </label>
            <label className="full">
              <span>Description</span>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly describe what this permission allows..."
                rows={3}
              />
            </label>
            <div className="full">
              <button className="btn primary" type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : editingPermission ? 'Update Permission' : 'Create Permission'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Permissions</h3>
            <p className="muted">All system permissions.</p>
          </div>
          <div className="table-filters" style={{ marginBottom: 0 }}>
            <div style={{ position: 'relative' }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>
        </div>

        {error ? <div className="alert error">{error.message}</div> : null}
        
        <div className="table">
          <div className="table-row table-head cols-4">
            <span>Name</span>
            <span>Slug</span>
            <span>Description</span>
            <span>Actions</span>
          </div>

          {isLoading ? (
            <div className="muted p-4 text-center">Loading permissions...</div>
          ) : permissionsData?.data?.length === 0 ? (
            <div className="muted p-4 text-center">No permissions found.</div>
          ) : (
            permissionsData?.data?.map((permission) => (
              <div key={permission.id} className="table-row cols-4">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-primary" style={{ color: 'var(--primary)' }} />
                  <span className="font-medium">{permission.name}</span>
                </div>
                <span>
                  <code className="badge" style={{ background: '#f1f5f9', color: '#475569', fontFamily: 'monospace' }}>
                    {permission.slug}
                  </code>
                </span>
                <span className="muted truncate" title={permission.description}>
                  {permission.description || '-'}
                </span>
                <div className="actions">
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={() => handleOpenForm(permission)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn danger"
                    type="button"
                    onClick={() => handleDelete(permission.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default PermissionsPage
