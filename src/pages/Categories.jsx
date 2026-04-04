import { useState } from 'react'
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '../services/categoriesApi'

const emptyForm = { name: '', slug: '', description: '' }

const defaultCategories = [
  { name: 'خبرونه' },
  { name: 'فرهنګي لیکنې' },
  { name: 'علمي لیکنې' },
  { name: 'دبستان مجله' },
  { name: 'دبستان پاډکاسټ' },
  { name: 'سیرت النبي کانفرانس', slug: 'seerat-al-nabi-conference' },
  { name: 'ادبي کانفرانس', slug: 'adabi-conference' },
  { name: 'علمی کانفرانس', slug: 'elmi-conference' },
  { name: 'فرهنګي کانفرانس', slug: 'farhangi-conference' },
  { name: 'کتابونه' },
  { name: 'تالیف' },
  { name: 'څېړنه' },
  { name: 'ژباړه' },
  { name: 'مخکتنه' },
  { name: 'ستاینغونډه' },
]

export default function CategoriesPage() {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const categoriesQuery = useCategoriesQuery()
  const createCategory = useCreateCategoryMutation()
  const updateCategory = useUpdateCategoryMutation()
  const deleteCategory = useDeleteCategoryMutation()

  const items = categoriesQuery.data ?? []
  const isLoading = categoriesQuery.isLoading
  const isSaving =
    createCategory.isPending || updateCategory.isPending || deleteCategory.isPending

  const getCategoryIdentifier = (item) => item?.id ?? item?._id ?? item?.slug ?? ''

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    try {
      if (editingId) {
        await updateCategory.mutateAsync({ id: editingId, payload: form })
      } else {
        await createCategory.mutateAsync(form)
      }
      setForm(emptyForm)
      setEditingId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (item) => {
    setEditingId(getCategoryIdentifier(item))
    setForm({
      name: item.name ?? '',
      slug: item.slug ?? '',
      description: item.description ?? '',
    })
  }

  const handleDelete = async (id) => {
    if (!id) {
      setError('Category id is missing')
      return
    }
    if (!window.confirm('Delete this category?')) {
      return
    }
    setError('')
    setNotice('')
    try {
      await deleteCategory.mutateAsync(id)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAddDefaults = async () => {
    setError('')
    setNotice('')
    let created = 0
    let skipped = 0

    for (const item of defaultCategories) {
      try {
        await createCategory.mutateAsync({
          name: item.name,
          description: item.description ?? '',
          ...(item.slug ? { slug: item.slug } : {}),
        })
        created += 1
      } catch (err) {
        if (err.message?.includes('409')) {
          skipped += 1
          continue
        }
        setError(err.message)
        return
      }
    }

    setNotice(
      `Added ${created} ${created === 1 ? 'category' : 'categories'}${
        skipped ? `, skipped ${skipped} existing` : ''
      }.`
    )
  }

  return (
    <section className="stack">
      <div className="card">
        <div className="card-header">
          <div>
            <h3>{editingId ? 'Edit Category' : 'Create Category'}</h3>
            <p className="muted">Create categories for posts and media.</p>
          </div>
          <div className="actions">
            {!editingId ? (
              <button className="btn ghost" type="button" onClick={handleAddDefaults}>
                Add Default Categories
              </button>
            ) : (
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
            )}
          </div>
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
            <span>Slug</span>
            <input
              type="text"
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              placeholder="auto-generated if left blank"
            />
          </label>
          <label className="full">
            <span>Description</span>
            <textarea
              rows={2}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </label>
          {notice ? <div className="alert full">{notice}</div> : null}
          {error ? <div className="alert error full">{error}</div> : null}
          <button className="btn primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Categories</h3>
            <p className="muted">Available categories.</p>
          </div>
        </div>
        {categoriesQuery.error ? (
          <div className="alert error">{categoriesQuery.error.message}</div>
        ) : null}
        {isLoading ? <div className="muted">Loading categories...</div> : null}
        {items.length === 0 && !isLoading ? <div className="muted">No categories yet.</div> : null}
        <div className="table">
          <div className="table-row table-head cols-4">
            <span>Name</span>
            <span>Slug</span>
            <span>Description</span>
            <span>Actions</span>
          </div>
          {items.map((item) => {
            const categoryId = getCategoryIdentifier(item)
            return (
              <div key={categoryId || item.slug || item.name} className="table-row cols-4">
                <span>{item.name}</span>
                <span>{item.slug}</span>
                <span>{item.description || '-'}</span>
                <div className="actions">
                  <button className="btn ghost" type="button" onClick={() => handleEdit(item)} disabled={!categoryId}>
                    Edit
                  </button>
                  <button className="btn danger" type="button" onClick={() => handleDelete(categoryId)} disabled={!categoryId}>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
