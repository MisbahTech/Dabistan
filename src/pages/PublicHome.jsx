import { useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PublicHeader from '../components/PublicHeader'
import CategoryMenu from '../components/CategoryMenu'
import { usePublicCategoriesQuery } from '../services/publicCategoriesApi'
import { useInfinitePublicPostsQuery, usePublicTrendingQuery } from '../services/publicPostsApi'
import { getPostImage, resolveMediaUrl } from '../utils/postMedia'

const EMPTY_LIST = []
const PAGE_SIZE = 40

const PASHTO_ALL = '\u067C\u0648\u0644'
const PASHTO_BRAND = '\u062F\u0628\u0633\u062A\u0627\u0646 \u0641\u0631\u0647\u0646\u06AB\u064A \u0645\u0631\u06A9\u0632'
const PASHTO_GALLERY = '\u06AB\u0627\u0644\u0631\u06CC'
const PASHTO_SEARCH_PLACEHOLDER = '\u0644\u067C\u0648\u0646...'
const PASHTO_LOADING = '\u0644\u06CC\u06A9\u0646\u06D0 \u0644\u0648\u0689\u06D0\u0696\u064A...'
const PASHTO_EMPTY = '\u0647\u06CC\u0685 \u0644\u06CC\u06A9\u0646\u0647 \u0648\u0646\u0647 \u0645\u0648\u0646\u0689\u0644 \u0634\u0648\u0647.'
const PASHTO_EXCERPT_FALLBACK = '\u062F \u062F\u06D0 \u0644\u06CC\u06A9\u0646\u06D0 \u0644\u0646\u0689\u06CC\u0632 \u0646\u0634\u062A\u0647.'
const PASHTO_READ_MORE = '\u0646\u0648\u0631 \u0648\u0644\u0648\u0644\u0626'
const PASHTO_SHOWCASE_TITLE = '\u062F \u0641\u06A9\u0631\u060C \u0627\u062D\u0633\u0627\u0633 \u0627\u0648 \u069A\u06A9\u0644\u0627 \u0631\u0648\u069A\u0627\u0646\u0647 \u0646\u0693\u06CD'
const PASHTO_SHOWCASE_TEXT =
  '\u062F\u0644\u062A\u0647 \u062F \u0642\u0644\u0645 \u0698\u0648\u0631 \u0641\u06A9\u0631\u0648\u0646\u0647\u060C \u062F \u0641\u0631\u0647\u0646\u06AB \u069A\u06A9\u0644\u0627\u060C \u062F \u0627\u062F\u0628 \u0646\u0627\u0632\u06A9 \u0627\u062D\u0633\u0627\u0633\u0627\u062A \u0627\u0648 \u0627\u0631\u0632\u069A\u062A\u0646\u0627\u06A9\u0647 \u0644\u06CC\u06A9\u0646\u06D0 \u067E\u0647 \u06CC\u0648\u0647 \u0681\u0627\u06CC \u06A9\u06D0 \u062F \u0631\u0648\u062D\u060C \u0645\u0627\u0646\u0627 \u0627\u0648 \u0698\u0648\u0631\u062A\u06CC\u0627 \u067E\u0647 \u0631\u0646\u06AB \u0648\u0644\u0648\u0644\u0626.'
const PASHTO_SECTION_KICKER = '\u062A\u0627\u0632\u0647 \u067E\u0631\u062A\u0644\u06D0'
const PASHTO_SECTION_TITLE = '\u062F \u0644\u0648\u0633\u062A \u0644\u067E\u0627\u0631\u0647 \u062F \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u0648\u0648 \u0645\u0648\u0636\u0648\u0639\u0627\u062A\u0648 \u06A9\u062A\u0627\u0631'

const PASHTO_TABS = {
  relevant: '\u0627\u0631\u0648\u0646\u062F',
  latest: '\u062A\u0627\u0632\u0647',
  top: '\u063A\u0648\u0631\u0647',
}

function getPublishedAt(post) {
  return post?.publishedAt || post?.published_at || ''
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('ps-AF-u-ca-persian', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function buildLink(slug, searchValue) {
  const params = new URLSearchParams()
  if (searchValue) params.set('q', searchValue)
  if (slug) params.set('category', slug)
  const query = params.toString()
  return `/${query ? `?${query}` : ''}`
}

export default function PublicHome() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const selectedCategory = searchParams.get('category') ?? ''
  const sortBy = searchParams.get('sort') ?? 'relevant'

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error: postsError,
  } = useInfinitePublicPostsQuery({
    q: search || undefined,
    category: selectedCategory || undefined,
    sort: sortBy,
    pageSize: PAGE_SIZE,
  })

  const categoriesQuery = usePublicCategoriesQuery()
  const trendingQuery = usePublicTrendingQuery()

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data ?? page) ?? EMPTY_LIST
  }, [data])

  const categories = categoriesQuery.data ?? EMPTY_LIST
  const error = postsError?.message || categoriesQuery.error?.message || ''
  
  // Infinite Scroll Trigger
  const observerRef = useRef()
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage, isFetchingNextPage])

  const handleSearchChange = (nextValue) => {
    const nextParams = {}
    if (nextValue) nextParams.q = nextValue
    if (selectedCategory) nextParams.category = selectedCategory
    if (sortBy !== 'relevant') nextParams.sort = sortBy
    setSearchParams(nextParams, { replace: true })
  }

  const handleSortChange = (nextSort) => {
    const nextParams = {}
    if (search) nextParams.q = search
    if (selectedCategory) nextParams.category = selectedCategory
    if (nextSort !== 'relevant') nextParams.sort = nextSort
    setSearchParams(nextParams)
  }

  const categoryLabel = useMemo(() => {
    const map = new Map(categories.map((cat) => [cat.slug, cat.name]))
    return (slug) => map.get(slug) ?? slug
  }, [categories])

  return (
    <div className="public-shell" dir="rtl">
      <PublicHeader
        categories={categories}
        activeCategory={selectedCategory}
        searchValue={search}
        onSearchChange={handleSearchChange}
        brandTag={PASHTO_BRAND}
      />

      <main className="public-main public-container">
        <div className="public-layout-grid">
          {/* Right Sidebar: Categories & Links */}
          <aside className="public-sidebar right">
            <CategoryMenu 
              categories={categories} 
              activeCategory={selectedCategory} 
              searchValue={search}
            />
          </aside>

          {/* Center Column: Post Feed */}
          <div className="public-feed-column">
            {/* Sorting Tabs */}
            <nav className="feed-tabs">
              {Object.entries(PASHTO_TABS).map(([key, label]) => (
                <button
                  key={key}
                  className={`feed-tab${sortBy === key ? ' active' : ''}`}
                  onClick={() => handleSortChange(key)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </nav>

            {error ? <div className="alert error">{error}</div> : null}
            {isLoading && posts.length === 0 ? <div className="muted">{PASHTO_LOADING}</div> : null}
            {!isLoading && posts.length === 0 ? <div className="muted">{PASHTO_EMPTY}</div> : null}

            <div className="posts-list">
              {posts.map((post, index) => {
                const image = getPostImage(post)
                const isFeatured = index === 0 && !search && !selectedCategory
                return (
                  <article
                    key={post.id}
                    className={`feed-post-card${isFeatured ? ' featured' : ''}`}
                    style={{ '--delay': `${index * 50}ms` }}
                  >
                    {image ? (
                      <Link to={`/post/${post.slug}`} className="post-cover-link">
                        <img className="post-cover" src={resolveMediaUrl(image)} alt={post.title} />
                      </Link>
                    ) : null}
                    <div className="post-body">
                      <div className="post-meta">
                        <span className="post-date">{formatDate(getPublishedAt(post))}</span>
                      </div>
                      <h2 className="post-title">
                        <Link to={`/post/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <div className="post-tags">
                        {post.category ? (
                          <Link to={buildLink(post.category, search)} className="post-tag">
                            #{categoryLabel(post.category)}
                          </Link>
                        ) : null}
                      </div>
                      <p className="post-excerpt">{post.excerpt || PASHTO_EXCERPT_FALLBACK}</p>
                      
                      <div className="post-footer">
                        <Link className="btn-read-more" to={`/post/${post.slug}`}>
                          {PASHTO_READ_MORE}
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {hasNextPage ? (
              <div ref={observerRef} className="infinite-scroll-trigger">
                {isFetchingNextPage ? (
                  <div className="shimmer-loader">
                    <span>{PASHTO_LOADING}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Left Sidebar: Extra Info */}
          <aside className="public-sidebar left">
            <div className="sidebar-card promo">
              <h3>{PASHTO_BRAND}</h3>
              <p>{PASHTO_SHOWCASE_TEXT}</p>
              <Link to="/login" className="btn btn-outline full">{'\u062F\u0627\u062E\u0644\u06D0\u062F\u0644'}</Link>
            </div>

            <div className="sidebar-card trending">
              <h3>{'\u063A\u0648\u0631\u0647 \u0644\u06CC\u06A9\u0646\u06D0'}</h3>
              <div className="trending-list">
                {trendingQuery.isLoading ? <p className="muted">Loading...</p> : null}
                {trendingQuery.data?.map((p, i) => (
                  <Link key={p.id} to={`/post/${p.slug}`} className="trending-item">
                    <span className="trending-rank">{i + 1}</span>
                    <div className="trending-info">
                      <span className="trending-title">{p.title}</span>
                      <span className="trending-date">{formatDate(getPublishedAt(p))}</span>
                    </div>
                  </Link>
                ))}
                {!trendingQuery.isLoading && !trendingQuery.data?.length ? (
                  <p className="muted">Coming soon...</p>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
