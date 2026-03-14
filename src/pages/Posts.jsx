import { useState } from 'react'
import {
  useCreatePostMutation,
  useDeletePostMutation,
  usePostsQuery,
  useUpdatePostMutation,
} from '../services/postsApi'
import { useUploadMutation } from '../services/uploadsApi'
import { useCategoriesQuery } from '../services/categoriesApi'

const emptyForm = {
  title: '',
  slug: '',
  category: '',
  status: 'draft',
  excerpt: '',
  content: '',
  featuredImage: '',
  attachment: null,
  publishedAt: '',
}

export default function PostsPage() {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [uploadingField, setUploadingField] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const postsQuery = usePostsQuery({
    q: search || undefined,
    status: statusFilter || undefined,
  })
  const categoriesQuery = useCategoriesQuery()

  const createPost = useCreatePostMutation()
  const updatePost = useUpdatePostMutation()
  const deletePost = useDeletePostMutation()
  const uploadMutation = useUploadMutation()

  const posts = postsQuery.data ?? []
  const categories = categoriesQuery.data ?? []
  const isLoading = postsQuery.isLoading
  const isSaving = createPost.isPending || updatePost.isPending || deletePost.isPending
  const listError = postsQuery.error?.message || categoriesQuery.error?.message || ''

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        publishedAt: form.publishedAt || null,
      }
      if (editingId) {
        await updatePost.mutateAsync({ id: editingId, payload })
      } else {
        await createPost.mutateAsync(payload)
      }
      setForm(emptyForm)
      setEditingId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (post) => {
    setEditingId(post.id)
    setForm({
      title: post.title ?? '',
      slug: post.slug ?? '',
      category: post.category ?? '',
      status: post.status ?? 'draft',
      excerpt: post.excerpt ?? '',
      content: post.content ?? '',
      featuredImage: post.featuredImage ?? '',
      attachment: post.attachment ?? null,
      publishedAt: post.publishedAt ? post.publishedAt.slice(0, 16) : '',
    })
  }

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) {
      return
    }
    setError('')
    try {
      await deletePost.mutateAsync(postId)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpload = async (event, field) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    setUploadingField(field)
    setError('')
    try {
      const uploaded = await uploadMutation.mutateAsync(file)
      if (field === 'featuredImage') {
        setForm((prev) => ({ ...prev, featuredImage: uploaded.url }))
      } else {
        setForm((prev) => ({ ...prev, attachment: uploaded }))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingField('')
    }
  }

  return (
    <section className="stack">
      <div className="card">
        <div className="card-header">
          <div>
            <h3>{editingId ? 'Edit Post' : 'Create Post'}</h3>
            <p className="muted">Manage drafts and published posts.</p>
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
              placeholder="auto-generated if left blank"
            />
          </label>
          <label>
            <span>Category</span>
            <input
              type="text"
              list="category-options"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="Select or type a category"
            />
            <datalist id="category-options">
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </datalist>
          </label>
          <label>
            <span>Status</span>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="full">
            <span>Excerpt</span>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
            />
          </label>
          <label className="full">
            <span>Content</span>
            <textarea
              rows={6}
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              required
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
          <label>
            <span>Featured Image URL</span>
            <input
              type="text"
              value={form.featuredImage}
              onChange={(event) => setForm((prev) => ({ ...prev, featuredImage: event.target.value }))}
              placeholder="https://..."
            />
          </label>
          <div className="upload-field">
            <span>Featured Image</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleUpload(event, 'featuredImage')} />
            {uploadingField === 'featuredImage' ? <span className="muted">Uploading...</span> : null}
            {form.featuredImage ? <small>{form.featuredImage}</small> : null}
          </div>
          <div className="upload-field">
            <span>Attachment</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/png,image/jpeg,image/webp"
              onChange={(event) => handleUpload(event, 'attachment')}
            />
            {uploadingField === 'attachment' ? <span className="muted">Uploading...</span> : null}
            {form.attachment ? <small>{form.attachment.originalName}</small> : null}
          </div>
          {error ? <div className="alert error full">{error}</div> : null}
          <button className="btn primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingId ? 'Update Post' : 'Create Post'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Posts</h3>
            <p className="muted">All posts in the system.</p>
          </div>
        </div>
        <div className="table-filters">
          <input
            type="search"
            placeholder="Search posts..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        {listError ? <div className="alert error">{listError}</div> : null}
        {isLoading ? <div className="muted">Loading posts...</div> : null}
        {posts.length === 0 && !isLoading ? <div className="muted">No posts yet.</div> : null}
        <div className="table">
          <div className="table-row table-head cols-5">
            <span>Title</span>
            <span>Status</span>
            <span>Category</span>
            <span>Author</span>
            <span>Actions</span>
          </div>
          {posts.map((post) => (
            <div key={post.id} className="table-row cols-5">
              <span>{post.title}</span>
              <span className={`badge ${post.status}`}>{post.status}</span>
              <span>{post.category || '-'}</span>
              <span>{post.author?.name ?? '-'}</span>
              <div className="actions">
                {post.status === 'published' ? (
                  <a className="btn ghost" href={`/post/${post.slug}`} target="_blank" rel="noreferrer">
                    View
                  </a>
                ) : null}
                <button className="btn ghost" type="button" onClick={() => handleEdit(post)}>
                  Edit
                </button>
                <button className="btn danger" type="button" onClick={() => handleDelete(post.id)}>
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
