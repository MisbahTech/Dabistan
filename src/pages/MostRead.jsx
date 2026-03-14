import { useState } from 'react'
import {
  useCreateMostReadMutation,
  useDeleteMostReadMutation,
  useMostReadQuery,
  useUpdateMostReadMutation,
} from '../services/mostReadApi'

const emptyForm = {
  title: '',
  slug: '',
  category: '',
  rank: 1,
  publishedAt: '',
}

export default function MostReadPage() {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const mostReadQuery = useMostReadQuery()
  const createMostRead = useCreateMostReadMutation()
  const updateMostRead = useUpdateMostReadMutation()
  const deleteMostRead = useDeleteMostReadMutation()

  const items = mostReadQuery.data ?? []
  const isLoading = mostReadQuery.isLoading
  const isSaving =
    createMostRead.isPending || updateMostRead.isPending || deleteMostRead.isPending

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const payload = { ...form, publishedAt: form.publishedAt || null }
      if (editingId) {
        await updateMostRead.mutateAsync({ id: editingId, payload })
      } else {
        await createMostRead.mutateAsync(payload)
      }
      setForm(emptyForm)
      setEditingId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item._id)
    setForm({
      title: item.title ?? '',
      slug: item.slug ?? '',
      category: item.category ?? '',
      rank: item.rank ?? 1,
      publishedAt: item.publishedAt ? item.publishedAt.slice(0, 16) : '',
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) {
      return
    }
    setError('')
    try {
      await deleteMostRead.mutateAsync(id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="stack">
      <div className="card">
        <div className="card-header">
          <div>
            <h3>{editingId ? 'Edit Most Read' : 'Add Most Read'}</h3>
            <p className="muted">Curate the most read stories list.</p>
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
            <span>Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </label>
          <label>
            <span>Slug</span>
            <input
              type="text"
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              required
            />
          </label>
          <label>
            <span>Category</span>
            <input
              type="text"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            />
          </label>
          <label>
            <span>Rank</span>
            <input
              type="number"
              min="1"
              value={form.rank}
              onChange={(event) => setForm((prev) => ({ ...prev, rank: event.target.value }))}
            />
          </label>
          <label>
            <span>Published At</span>
            <input
              type="datetime-local"
              value={form.publishedAt}
              onChange={(event) => setForm((prev) => ({ ...prev, publishedAt: event.target.value }))}
            />
          </label>
          {error ? <div className="alert error full">{error}</div> : null}
          <button className="btn primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingId ? 'Update Entry' : 'Add Entry'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Most Read</h3>
            <p className="muted">Ordered by rank.</p>
          </div>
        </div>
        {mostReadQuery.error ? (
          <div className="alert error">{mostReadQuery.error.message}</div>
        ) : null}
        {isLoading ? <div className="muted">Loading entries...</div> : null}
        {items.length === 0 && !isLoading ? <div className="muted">No entries yet.</div> : null}
        <div className="table">
          <div className="table-row table-head cols-4">
            <span>Title</span>
            <span>Category</span>
            <span>Rank</span>
            <span>Actions</span>
          </div>
          {items.map((item) => (
            <div key={item._id} className="table-row cols-4">
              <span>{item.title}</span>
              <span>{item.category || '-'}</span>
              <span>{item.rank ?? '-'}</span>
              <div className="actions">
                <button className="btn ghost" type="button" onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button className="btn danger" type="button" onClick={() => handleDelete(item._id)}>
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
