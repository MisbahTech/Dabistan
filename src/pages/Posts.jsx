import { useState } from 'react'
import {
  useCreatePostMutation,
  useDeletePostMutation,
  usePostsQuery,
  useUpdatePostMutation,
} from '../services/postsApi'
import { useUploadMutation } from '../services/uploadsApi'
import { useCategoriesQuery } from '../services/categoriesApi'
import { useAuth } from '../context/useAuth'

const emptyForm = {
  title: '',
  slug: '',
  category: '',
  sectionSlug: 'news',
  status: 'draft',
  excerpt: '',
  content: '',
  featuredImage: '',
  galleryImages: [],
  attachment: null,
  publishedAt: '',
}

function getPostRowId(post) {
  return post?.id ?? post?._id ?? null
}

function toSlug(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))]
}

function normalizeAttachment(uploaded) {
  if (!uploaded?.url) {
    return null
  }

  return {
    url: uploaded.url,
    name: uploaded.name || uploaded.originalName || '',
    originalName: uploaded.originalName || uploaded.name || '',
    size: uploaded.size || 0,
    mimetype: uploaded.mimetype || '',
  }
}

export default function PostsPage() {
  const { user } = useAuth()
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
      const fallbackAuthor = user?.email || user?.name || 'admin'
      const slug = form.slug.trim() || toSlug(form.title)
      const payload = {
        title: form.title,
        slug,
        category: form.category || '',
        section_slug: form.sectionSlug || 'news',
        status: form.status,
        excerpt: form.excerpt || '',
        content: form.content,
        image: form.featuredImage || form.galleryImages[0] || '',
        gallery: uniqueValues([form.featuredImage, ...form.galleryImages]),
        attachment: normalizeAttachment(form.attachment),
        published_at: form.publishedAt || null,
        author: fallbackAuthor,
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
    const rowId = getPostRowId(post)
    if (!rowId) {
      setError('This post cannot be edited because it has no valid ID.')
      return
    }

    const galleryImages = uniqueValues([post.image, ...(Array.isArray(post.gallery) ? post.gallery : [])])

    setEditingId(rowId)
    setForm({
      title: post.title ?? '',
      slug: post.slug ?? '',
      category: post.category ?? '',
      sectionSlug: post.section_slug ?? post.sectionSlug ?? 'news',
      status: post.status ?? 'draft',
      excerpt: post.excerpt ?? '',
      content: post.content ?? '',
      featuredImage: post.image ?? post.featuredImage ?? galleryImages[0] ?? '',
      galleryImages,
      attachment: normalizeAttachment(post.attachment),
      publishedAt: (post.published_at ?? post.publishedAt)
        ? (post.published_at ?? post.publishedAt).slice(0, 16)
        : '',
    })
  }

  const handleDelete = async (postId) => {
    if (!postId) {
      setError('This post cannot be deleted because it has no valid ID.')
      return
    }

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
    const files = Array.from(event.target.files ?? [])
    if (!files.length) {
      return
    }
    setUploadingField(field)
    setError('')
    try {
      if (field === 'galleryImages') {
        const uploadedItems = await Promise.all(files.map((file) => uploadMutation.mutateAsync(file)))
        const uploadedUrls = uploadedItems.map((item) => item.url).filter(Boolean)
        setForm((prev) => ({
          ...prev,
          featuredImage: prev.featuredImage || uploadedUrls[0] || '',
          galleryImages: uniqueValues([...prev.galleryImages, ...uploadedUrls]),
        }))
      } else {
        const uploaded = await uploadMutation.mutateAsync(files[0])
        if (field === 'featuredImage') {
          setForm((prev) => ({
            ...prev,
            featuredImage: uploaded.url,
            galleryImages: uniqueValues([uploaded.url, ...prev.galleryImages]),
          }))
        } else {
          setForm((prev) => ({ ...prev, attachment: normalizeAttachment(uploaded) }))
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      event.target.value = ''
      setUploadingField('')
    }
  }

  const handleRemoveImage = (imageUrl) => {
    setForm((prev) => {
      const galleryImages = prev.galleryImages.filter((item) => item !== imageUrl)
      return {
        ...prev,
        galleryImages,
        featuredImage: prev.featuredImage === imageUrl ? galleryImages[0] || '' : prev.featuredImage,
      }
    })
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
                <option key={cat.id ?? cat._id ?? cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </datalist>
          </label>
          <label>
            <span>Section Slug</span>
            <input
              type="text"
              value={form.sectionSlug}
              onChange={(event) => setForm((prev) => ({ ...prev, sectionSlug: event.target.value }))}
              placeholder="news"
              required
            />
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
            <span>Post Images</span>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => handleUpload(event, 'galleryImages')}
            />
            {uploadingField === 'galleryImages' ? <span className="muted">Uploading...</span> : null}
            {form.galleryImages.length ? <small>{form.galleryImages.length} image(s) selected</small> : null}
          </div>
          {form.galleryImages.length ? (
            <div className="upload-preview full">
              {form.galleryImages.map((imageUrl, index) => (
                <div key={imageUrl} className={`media-pill${form.featuredImage === imageUrl ? ' featured' : ''}`}>
                  <a className="link" href={imageUrl} target="_blank" rel="noreferrer">
                    {`Image ${index + 1}`}
                  </a>
                  <div className="media-pill-actions">
                    <button
                      className="btn ghost"
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, featuredImage: imageUrl }))}
                    >
                      {form.featuredImage === imageUrl ? 'Featured' : 'Set Featured'}
                    </button>
                    <button className="btn danger" type="button" onClick={() => handleRemoveImage(imageUrl)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <div className="upload-field">
            <span>PDF</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) => handleUpload(event, 'attachment')}
            />
            {uploadingField === 'attachment' ? <span className="muted">Uploading...</span> : null}
            {form.attachment ? (
              <small>{form.attachment.originalName || form.attachment.name || 'Uploaded PDF'}</small>
            ) : null}
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
          {posts.map((post, index) => {
            const rowId = getPostRowId(post)
            const rowKey = rowId ?? `${post.slug ?? 'post'}-${index}`

            return (
              <div key={rowKey} className="table-row cols-5">
                <span>{post.title}</span>
                <span className={`badge ${post.status}`}>{post.status}</span>
                <span>{post.category || '-'}</span>
                <span>{typeof post.author === 'string' ? post.author : post.author?.name ?? '-'}</span>
                <div className="actions">
                  {post.status === 'published' ? (
                    <a className="btn ghost" href={`/post/${post.slug}`} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : null}
                  <button className="btn ghost" type="button" onClick={() => handleEdit(post)} disabled={!rowId}>
                    Edit
                  </button>
                  <button className="btn danger" type="button" onClick={() => handleDelete(rowId)} disabled={!rowId}>
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
