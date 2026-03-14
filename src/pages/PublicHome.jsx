import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { API_BASE_URL } from '../config/apiConfig'
import PublicHeader from '../components/PublicHeader'
import { usePublicCategoriesQuery } from '../services/publicCategoriesApi'
import { usePublicPostsQuery } from '../services/publicPostsApi'

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
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export default function PublicHome() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') ?? ''
  )

  const postsQuery = usePublicPostsQuery({
    q: search || undefined,
    category: selectedCategory || undefined,
  })
  const categoriesQuery = usePublicCategoriesQuery()

  const posts = postsQuery.data ?? []
  const categories = categoriesQuery.data ?? []
  const error = postsQuery.error?.message || categoriesQuery.error?.message || ''
  const isLoading = postsQuery.isLoading

  useEffect(() => {
    const nextSearch = searchParams.get('q') ?? ''
    const nextCategory = searchParams.get('category') ?? ''
    if (nextSearch !== search) setSearch(nextSearch)
    if (nextCategory !== selectedCategory) setSelectedCategory(nextCategory)
  }, [searchParams, search, selectedCategory])

  useEffect(() => {
    const nextParams = {}
    if (search) nextParams.q = search
    if (selectedCategory) nextParams.category = selectedCategory
    setSearchParams(nextParams, { replace: true })
  }, [search, selectedCategory, setSearchParams])

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
        onSearchChange={setSearch}
        brandTag="?????? ????"
        showSearch
      />

      <section className="public-content">
        {error ? <div className="alert error">{error}</div> : null}
        {isLoading ? <div className="muted">????? ??????...</div> : null}
        {!isLoading && posts.length === 0 ? (
          <div className="muted">?? ???? ???? ??? ????? ????.</div>
        ) : null}

        {featured ? (
          <article className={`post-featured${featured.featuredImage ? '' : ' no-media'}`}>
            <div className="post-featured-body">
              <div className="post-meta">
                {featured.category ? (
                  <span className="tag">{categoryLabel(featured.category)}</span>
                ) : null}
                {featured.publishedAt ? <span>{formatDate(featured.publishedAt)}</span> : null}
              </div>
              <h2 className="post-title">
                <Link to={`/post/${featured.slug}`}>{featured.title}</Link>
              </h2>
              <p className="post-excerpt">
                {featured.excerpt || '? ???? ???? ????? ?????.'}
              </p>
              <div className="post-footer">
                <Link className="btn primary" to={`/post/${featured.slug}`}>
                  ?????
                </Link>
              </div>
            </div>
            {featured.featuredImage ? (
              <img
                className="post-cover"
                src={resolveMediaUrl(featured.featuredImage)}
                alt={featured.title}
              />
            ) : null}
          </article>
        ) : null}

        <div className="public-grid">
          {rest.map((post, index) => (
            <article
              key={post.id}
              className="post-card"
              style={{ '--delay': `${index * 80}ms` }}
            >
              {post.featuredImage ? (
                <img
                  className="post-cover"
                  src={resolveMediaUrl(post.featuredImage)}
                  alt={post.title}
                />
              ) : null}
              <div className="post-body">
                <div className="post-meta">
                  {post.category ? <span className="tag">{categoryLabel(post.category)}</span> : null}
                  {post.publishedAt ? <span>{formatDate(post.publishedAt)}</span> : null}
                </div>
                <h2 className="post-title">
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="post-excerpt">{post.excerpt || '? ???? ???? ????? ?????.'}</p>
                <div className="post-footer">
                  <Link className="btn primary" to={`/post/${post.slug}`}>
                    ?????
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
