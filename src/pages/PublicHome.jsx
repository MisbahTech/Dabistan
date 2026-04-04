import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { API_BASE_URL } from '../config/apiConfig'
import PublicFooter from '../components/PublicFooter'
import PublicHeader from '../components/PublicHeader'
import { usePublicCategoriesQuery } from '../services/publicCategoriesApi'
import { usePublicPostsQuery } from '../services/publicPostsApi'

const apiOrigin = API_BASE_URL.replace(/\/api$/, '')
const EMPTY_LIST = []

const PASHTO_BRAND = '\u0641\u0631\u0647\u0646\u06AB\u064A \u0645\u0631\u06A9\u0632'
const PASHTO_SEARCH_PLACEHOLDER = '\u0644\u067C\u0648\u0646...'
const PASHTO_LOADING = '\u0644\u06CC\u06A9\u0646\u06D0 \u0644\u0648\u0689\u06D0\u0696\u064A...'
const PASHTO_EMPTY = '\u0647\u06CC\u0685 \u0644\u06CC\u06A9\u0646\u0647 \u0648\u0646\u0647 \u0645\u0648\u0646\u0689\u0644 \u0634\u0648\u0647.'
const PASHTO_EXCERPT_FALLBACK = '\u062F \u062F\u06D0 \u0644\u06CC\u06A9\u0646\u06D0 \u0644\u0646\u0689\u06CC\u0632 \u0646\u0634\u062A\u0647.'
const PASHTO_READ_MORE = '\u0646\u0648\u0631 \u0648\u0644\u0648\u0644\u0626'

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

function getPostImage(post) {
  return post?.featuredImage || post?.image || ''
}

function getPublishedAt(post) {
  return post?.publishedAt || post?.published_at || ''
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export default function PublicHome() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const selectedCategory = searchParams.get('category') ?? ''

  const postsQuery = usePublicPostsQuery({
    q: search || undefined,
    category: selectedCategory || undefined,
  })
  const categoriesQuery = usePublicCategoriesQuery()

  const posts = postsQuery.data ?? EMPTY_LIST
  const categories = categoriesQuery.data ?? EMPTY_LIST
  const error = postsQuery.error?.message || categoriesQuery.error?.message || ''
  const isLoading = postsQuery.isLoading

  const handleSearchChange = (nextValue) => {
    const nextParams = {}
    if (nextValue) nextParams.q = nextValue
    if (selectedCategory) nextParams.category = selectedCategory
    setSearchParams(nextParams, { replace: true })
  }

  const categoryLabel = useMemo(() => {
    const map = new Map(categories.map((cat) => [cat.slug, cat.name]))
    return (slug) => map.get(slug) ?? slug
  }, [categories])

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="public-shell" dir="rtl">
      <PublicHeader
        categories={categories}
        activeCategory={selectedCategory}
        searchValue={search}
        brandTag={PASHTO_BRAND}
      />

      <main className="public-main">
        <section className="public-content public-container">
          <div className="public-tools">
            <input
              type="search"
              placeholder={` ${PASHTO_SEARCH_PLACEHOLDER}`}
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </div>

          {error ? <div className="alert error">{error}</div> : null}
          {isLoading ? <div className="muted">{PASHTO_LOADING}</div> : null}
          {!isLoading && posts.length === 0 ? <div className="muted">{PASHTO_EMPTY}</div> : null}

          {featured ? (
            <article className={`post-featured${getPostImage(featured) ? '' : ' no-media'}`}>
              <div className="post-featured-body">
                <div className="post-meta">
                  {featured.category ? <span className="tag">{categoryLabel(featured.category)}</span> : null}
                  {getPublishedAt(featured) ? <span>{formatDate(getPublishedAt(featured))}</span> : null}
                </div>
                <h2 className="post-title">
                  <Link to={`/post/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p className="post-excerpt">{featured.excerpt || PASHTO_EXCERPT_FALLBACK}</p>
                <div className="post-footer">
                  <Link className="btn primary" to={`/post/${featured.slug}`}>
                    {PASHTO_READ_MORE}
                  </Link>
                </div>
              </div>
              {getPostImage(featured) ? (
                <img
                  className="post-cover"
                  src={resolveMediaUrl(getPostImage(featured))}
                  alt={featured.title}
                />
              ) : null}
            </article>
          ) : null}

          <div className="public-grid">
            {rest.map((post, index) => (
              <article key={post.id} className="post-card" style={{ '--delay': `${index * 80}ms` }}>
                {getPostImage(post) ? (
                  <img className="post-cover" src={resolveMediaUrl(getPostImage(post))} alt={post.title} />
                ) : null}
                <div className="post-body">
                  <div className="post-meta">
                    {post.category ? <span className="tag">{categoryLabel(post.category)}</span> : null}
                    {getPublishedAt(post) ? <span>{formatDate(getPublishedAt(post))}</span> : null}
                  </div>
                  <h2 className="post-title">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="post-excerpt">{post.excerpt || PASHTO_EXCERPT_FALLBACK}</p>
                  <div className="post-footer">
                    <Link className="btn primary" to={`/post/${post.slug}`}>
                      {PASHTO_READ_MORE}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
