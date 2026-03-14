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
  const allPermissions = permissionsQuery.data?.data ?? (Array.isArray(permissionsQuery.data) ? permissionsQuery.data : [])
  
  const filteredPermissions = useMemo(() => {
    if (!permissionSearch) return allPermissions
    return allPermissions.filter(p => 
      p.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(permissionSearch.toLowerCase())
    )
  }, [allPermissions, permissionSearch])

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
            <ShieldCheck className="w-8 h-8 text-indigo-500" />
            Role Management
          </h1>
          <p className="text-slate-400 mt-1">Define security roles and assign granular permissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl overflow-hidden shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {editingId ? <Edit2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                {editingId ? 'Edit Role' : 'Create New Role'}
              </h3>
              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null)
                    setForm(emptyForm)
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Content Editor"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Role Slug</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g., editor"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={editingId && form.slug === 'admin'}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-400">Permissions</label>
                  <span className="text-xs text-indigo-400 font-medium">
                    {form.permissions.length} selected
                  </span>
                </div>
                
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={permissionSearch}
                    onChange={(e) => setPermissionSearch(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-md pl-7 pr-4 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>

                <div className="bg-slate-900 rounded-lg border border-slate-700 h-[300px] overflow-y-auto divide-y divide-slate-800">
                  {filteredPermissions.map(permission => (
                    <div 
                      key={permission.slug}
                      onClick={() => togglePermission(permission.slug)}
                      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-800 transition-colors ${
                        form.permissions.includes(permission.slug) ? 'bg-indigo-500/5' : ''
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        form.permissions.includes(permission.slug) 
                          ? 'bg-indigo-500 border-indigo-500' 
                          : 'border-slate-600'
                      }`}>
                        {form.permissions.includes(permission.slug) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{permission.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono truncate">{permission.slug}</p>
                      </div>
                    </div>
                  ))}
                  {filteredPermissions.length === 0 && (
                    <div className="p-4 text-center text-slate-500 text-sm">No permissions found</div>
                  )}
                </div>
              </div>

              {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {isSaving ? 'Saving...' : editingId ? 'Update Role' : 'Create Role'}
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Permissions</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {isLoading ? (
                    <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-500">Loading roles...</td></tr>
                  ) : roles.map((role) => (
                    <tr key={role.id} className="hover:bg-slate-700/30 group transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            role.slug === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'
                          }`}>
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-medium text-slate-200">{role.name}</span>
                            <div className="text-[10px] font-mono text-slate-500">{role.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-sm">
                          {role.permissions?.length > 0 ? (
                            role.permissions.map((p) => (
                              <span 
                                key={typeof p === 'string' ? p : p.slug}
                                className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-indigo-300 text-[10px] font-medium"
                              >
                                {typeof p === 'string' ? p : p.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 text-xs italic">No permissions assigned</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(role)}
                            className="p-2 hover:bg-slate-700 text-indigo-400 rounded-lg transition-colors"
                            title="Edit Role"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {role.slug !== 'admin' ? (
                            <button
                              onClick={() => handleDelete(role.id)}
                              className="p-2 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                              title="Delete Role"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="p-2 text-slate-600" title="System Role cannot be deleted">
                              <Lock className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
