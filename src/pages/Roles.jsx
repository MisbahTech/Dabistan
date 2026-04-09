import { useState, useMemo } from 'react'
import {
  useRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '../services/rolesApi'
import { usePermissionsQuery } from '../services/permissionsApi'
import { Plus, Shield, ShieldCheck, Edit2, Trash2, X, Check, Search, Lock } from 'lucide-react'

const emptyForm = { name: '', slug: '', permissions: [] }

export default function RolesPage() {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [permissionSearch, setPermissionSearch] = useState('')

  const rolesQuery = useRolesQuery()
  const permissionsQuery = usePermissionsQuery()
  const createRole = useCreateRoleMutation()
  const updateRole = useUpdateRoleMutation()
  const deleteRole = useDeleteRoleMutation()

  const roles = rolesQuery.data?.data ?? (Array.isArray(rolesQuery.data) ? rolesQuery.data : [])

  const filteredPermissions = useMemo(() => {
    const allPermissions = permissionsQuery.data?.data ?? (Array.isArray(permissionsQuery.data) ? permissionsQuery.data : [])
    if (!permissionSearch) return allPermissions
    return allPermissions.filter(p => 
      p.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(permissionSearch.toLowerCase())
    )
  }, [permissionsQuery.data, permissionSearch])

  const isLoading = rolesQuery.isLoading || permissionsQuery.isLoading
  const isSaving = createRole.isPending || updateRole.isPending || deleteRole.isPending

  const togglePermission = (slug) => {
    setForm(prev => {
      const permissions = prev.permissions.includes(slug)
        ? prev.permissions.filter(p => p !== slug)
        : [...prev.permissions, slug]
      return { ...prev, permissions }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const payload = { ...form }

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
      permissions: Array.isArray(role.permissions) 
        ? role.permissions.map(p => typeof p === 'string' ? p : p.slug)
        : [],
    })
  }

  const handleDelete = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role? This will affect all users assigned to it.')) {
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
            <p className="muted">Define security roles and assign granular permissions.</p>
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
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Content Editor"
            />
          </label>
          <label>
            <span>Role Slug</span>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              placeholder="e.g., editor"
              disabled={editingId && form.slug === 'admin'}
            />
          </label>
          
          <div className="full">
            <div className="card" style={{ padding: '1rem', background: '#f8fafc', borderStyle: 'dashed' }}>
              <div className="card-header" style={{ marginBottom: '0.8rem' }}>
                <span style={{ fontWeight: 600 }}>Permissions ({form.permissions.length} selected)</span>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={permissionSearch}
                    onChange={(e) => setPermissionSearch(e.target.value)}
                    style={{ padding: '0.35rem 0.7rem 0.35rem 2rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
              
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                gap: '0.5rem',
                padding: '0.2rem'
              }}>
                {filteredPermissions.map(permission => (
                  <div 
                    key={permission.slug}
                    onClick={() => togglePermission(permission.slug)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      background: form.permissions.includes(permission.slug) ? 'rgba(15, 111, 104, 0.08)' : '#fff',
                      border: `1px solid ${form.permissions.includes(permission.slug) ? 'rgba(15, 111, 104, 0.25)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: `1px solid ${form.permissions.includes(permission.slug) ? 'var(--primary)' : '#cbd5e1'}`,
                      background: form.permissions.includes(permission.slug) ? 'var(--primary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {form.permissions.includes(permission.slug) && <Check style={{ width: '12px', height: '12px', color: '#fff' }} strokeWidth={4} />}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{permission.name}</div>
                      <div className="muted" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>{permission.slug}</div>
                    </div>
                  </div>
                ))}
                {filteredPermissions.length === 0 && (
                  <div className="muted full text-center p-4">No permissions found</div>
                )}
              </div>
            </div>
          </div>

          {error ? <div className="alert error full">{error}</div> : null}
          
          <div className="full">
            <button className="btn primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingId ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Roles</h3>
            <p className="muted">All system roles.</p>
          </div>
        </div>

        {rolesQuery.error ? <div className="alert error">{rolesQuery.error.message}</div> : null}
        
        <div className="table">
          <div className="table-row table-head cols-4">
            <span>Role</span>
            <span>Permissions</span>
            <span>Actions</span>
          </div>

          {isLoading ? (
            <div className="muted p-4 text-center">Loading roles...</div>
          ) : roles.map((role) => (
            <div key={role.id} className="table-row cols-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" style={{ color: role.slug === 'admin' ? '#f59e0b' : 'var(--primary)' }} />
                <div>
                  <span className="font-medium">{role.name}</span>
                  <div className="muted" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>{role.slug}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {role.permissions?.length > 0 ? (
                  role.permissions.map((p) => (
                    <span 
                      key={typeof p === 'string' ? p : p.slug}
                      className="badge"
                      style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.7rem' }}
                    >
                      {typeof p === 'string' ? p : p.name}
                    </span>
                  ))
                ) : (
                  <span className="muted" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>None</span>
                )}
              </div>
              <div className="actions">
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => handleEdit(role)}
                >
                  Edit
                </button>
                {role.slug !== 'admin' ? (
                  <button
                    className="btn danger"
                    type="button"
                    onClick={() => handleDelete(role.id)}
                  >
                    Delete
                  </button>
                ) : (
                  <div title="System Role cannot be deleted">
                    <Lock className="w-4 h-4 text-muted" style={{ opacity: 0.5 }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

