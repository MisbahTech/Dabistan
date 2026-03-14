import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { API_BASE_URL } from '../config/apiConfig'
import PublicHeader from '../components/PublicHeader'
import { usePublicCategoriesQuery } from '../services/publicCategoriesApi'
import { usePublicPostQuery } from '../services/publicPostsApi'

const apiOrigin = API_BASE_URL.replace(/\/api$/, '')

function resolveMediaUrl(value) {
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }
  if (value.startsWith('/')) {
    return `${apiOrigin}${value}`
  }
  return value
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export default function PublicPost() {
  const { slug } = useParams()
  const postQuery = usePublicPostQuery(slug)
  const categoriesQuery = usePublicCategoriesQuery()

  const post = postQuery.data ?? null
  const categories = categoriesQuery.data ?? []
  const error = postQuery.error?.message || categoriesQuery.error?.message || ''

  const meta = useMemo(() => {
    if (!post) return ''
    const date = post.publishedAt ? formatDate(post.publishedAt) : ''
    const author = post.author?.name ? `?? ${post.author.name}` : ''
    return [date, author].filter(Boolean).join(' � ')
  }, [post])

  const categoryLabel = useMemo(() => {
    const map = new Map(categories.map((cat) => [cat.slug, cat.name]))
    return (value) => map.get(value) ?? value
  }, [categories])

  return (
    <div className="public-shell" dir="rtl">
      <PublicHeader
        categories={categories}
        activeCategory={post?.category ?? ''}
        brandTag="????????"
        showBackLink={false}
        showLogin={false}
      />

      <section className="public-hero compact">
        <div>
          <p className="public-eyebrow">??????</p>
          <h1>{post?.title || '????'}</h1>
          <p className="public-subtitle">{meta || '? ?????? ????'}</p>
        </div>
      </section>

      <section className="public-content">
        {postQuery.isLoading ? <div className="muted">???? ??????...</div> : null}
        {error ? <div className="alert error">{error}</div> : null}

        {post ? (
          <article className="post-detail">
            {post.featuredImage ? (
              <img
                className="post-cover detail"
                src={resolveMediaUrl(post.featuredImage)}
                alt={post.title}
              />
            ) : null}
            <div className="post-body">
              {post.category ? <span className="tag">{categoryLabel(post.category)}</span> : null}
              <h2 className="post-title">{post.title}</h2>
              {meta ? <p className="post-meta">{meta}</p> : null}
              <div className="post-content">{post.content}</div>
              {post.attachment?.url ? (
                <div className="post-attachment">
                  <span>?????:</span>
                  <a
                    className="link"
                    href={resolveMediaUrl(post.attachment.url)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {post.attachment.originalName || '???? ?????? ???'}
                  </a>
                </div>
              ) : null}
            </div>
          </article>
        ) : null}
      </section>
    </div>
  )
}
