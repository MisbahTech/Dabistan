import { useState } from 'react'
import {
  useCreateVideoMutation,
  useDeleteVideoMutation,
  useUpdateVideoMutation,
  useVideosQuery,
} from '../services/videosApi'

const emptyForm = {
  title: '',
  url: '',
  thumbnail: '',
  category: '',
  duration: '',
  description: '',
  publishedAt: '',
}

export default function VideosPage() {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const videosQuery = useVideosQuery()
  const createVideo = useCreateVideoMutation()
  const updateVideo = useUpdateVideoMutation()
  const deleteVideo = useDeleteVideoMutation()

  const items = videosQuery.data ?? []
  const isLoading = videosQuery.isLoading
  const isSaving = createVideo.isPending || updateVideo.isPending || deleteVideo.isPending

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const payload = { ...form, publishedAt: form.publishedAt || null }
      if (editingId) {
        await updateVideo.mutateAsync({ id: editingId, payload })
      } else {
        await createVideo.mutateAsync(payload)
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
      url: item.url ?? '',
      thumbnail: item.thumbnail ?? '',
      category: item.category ?? '',
      duration: item.duration ?? '',
      description: item.description ?? '',
      publishedAt: item.publishedAt ? item.publishedAt.slice(0, 16) : '',
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) {
      return
    }
    setError('')
    try {
      await deleteVideo.mutateAsync(id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="stack">
      <div className="card">
        <div className="card-header">
          <div>
            <h3>{editingId ? 'Edit Video' : 'Add Video'}</h3>
            <p className="muted">Manage video content links and metadata.</p>
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
            <span>Video URL</span>
            <input
              type="url"
              value={form.url}
              onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
              required
            />
          </label>
          <label>
            <span>Thumbnail URL</span>
            <input
              type="url"
              value={form.thumbnail}
              onChange={(event) => setForm((prev) => ({ ...prev, thumbnail: event.target.value }))}
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
            <span>Duration</span>
            <input
              type="text"
              value={form.duration}
              onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
              placeholder="e.g. 05:30"
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
          <label className="full">
            <span>Description</span>
            <textarea
              rows={2}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </label>
          {error ? <div className="alert error full">{error}</div> : null}
          <button className="btn primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingId ? 'Update Video' : 'Add Video'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Videos</h3>
            <p className="muted">All video entries.</p>
          </div>
        </div>
        {videosQuery.error ? (
          <div className="alert error">{videosQuery.error.message}</div>
        ) : null}
        {isLoading ? <div className="muted">Loading videos...</div> : null}
        {items.length === 0 && !isLoading ? <div className="muted">No videos yet.</div> : null}
        <div className="table">
          <div className="table-row table-head cols-4">
            <span>Title</span>
            <span>Category</span>
            <span>Published</span>
            <span>Actions</span>
          </div>
          {items.map((item) => (
            <div key={item._id} className="table-row cols-4">
              <span>{item.title}</span>
              <span>{item.category || '-'}</span>
              <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '-'}</span>
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
