import { Compass, Search, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import heroAsset from '../assets/hero-asset.png'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PublicFooter from '../components/PublicFooter'
import PublicHeader from '../components/PublicHeader'
import { usePublicCategoriesQuery } from '../services/publicCategoriesApi'
import { usePublicPostsQuery } from '../services/publicPostsApi'
import { getPostImage, resolveMediaUrl } from '../utils/postMedia'

const EMPTY_LIST = []
const PAGE_SIZE = 40

const PASHTO_ALL = '\u067C\u0648\u0644'
const PASHTO_BRAND = '\u0641\u0631\u0647\u0646\u06AB\u064A \u0645\u0631\u06A9\u0632'
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

export default function PublicHome() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const selectedCategory = searchParams.get('category') ?? ''
  const currentPage = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)

  const postsQuery = usePublicPostsQuery({
    q: search || undefined,
    category: selectedCategory || undefined,
    page: currentPage,
    pageSize: PAGE_SIZE,
  })
  const categoriesQuery = usePublicCategoriesQuery()

  const postsResponse = postsQuery.data
  const posts = postsResponse?.data ?? postsResponse ?? EMPTY_LIST
  const categories = categoriesQuery.data ?? EMPTY_LIST
  const error = postsQuery.error?.message || categoriesQuery.error?.message || ''
  const isLoading = postsQuery.isLoading
  const totalPosts = postsResponse?.pagination?.total ?? posts.length
  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE))
  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages])

  const handleSearchChange = (nextValue) => {
    const nextParams = {}
    if (nextValue) nextParams.q = nextValue
    if (selectedCategory) nextParams.category = selectedCategory
    setSearchParams(nextParams, { replace: true })
  }

  const handlePageChange = (page) => {
    const nextParams = {}
    if (search) nextParams.q = search
    if (selectedCategory) nextParams.category = selectedCategory
    if (page > 1) nextParams.page = String(page)
    setSearchParams(nextParams, { replace: true })
  }

  const categoryLabel = useMemo(() => {
    const map = new Map(categories.map((cat) => [cat.slug, cat.name]))
    return (slug) => map.get(slug) ?? slug
  }, [categories])
  const activeCategoryLabel = selectedCategory ? categoryLabel(selectedCategory) : PASHTO_ALL

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
        {/* 
          Premium Hero Section 
          Feature: Full-bleed gradient background with 3D cinematic assets.
          RTL Note: hero-content displays on the right, hero-visual on the left.
        */}
        <section className="premium-hero">
          <div className="hero-bg-accent" />
          <div className="hero-bottom-fade" />
          <div className="public-container premium-hero-inner">
            <div className="hero-content">
              <h1>{PASHTO_SHOWCASE_TITLE}</h1>
              <p className="hero-subtitle">{PASHTO_SHOWCASE_TEXT}</p>

              <div className="premium-search-container">
                <Search size={22} className="muted" />
                <input
                  type="search"
                  placeholder={PASHTO_SEARCH_PLACEHOLDER}
                  value={search}
                  onChange={(event) => handleSearchChange(event.target.value)}
                />
              </div>

              <div className="hero-actions">
                <Link className="premium-btn premium-btn-primary" to="/gallery">
                  <ImageIcon size={20} />
                  <span>{PASHTO_GALLERY}</span>
                </Link>
                <button 
                  className="premium-btn premium-btn-outline"
                  onClick={() => document.getElementById('featured-post')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Compass size={20} />
                  <span>{PASHTO_READ_MORE}</span>
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <img src={heroAsset} alt="Dabistan Hero" className="hero-asset" />
            </div>
          </div>
        </section>

        <section className="public-content public-container">

          {error ? <div className="alert error">{error}</div> : null}
          {isLoading ? <div className="muted">{PASHTO_LOADING}</div> : null}
          {!isLoading && posts.length === 0 ? <div className="muted">{PASHTO_EMPTY}</div> : null}

          {!isLoading && posts.length > 0 ? (
            <section className="public-section-head">
              <div>
                <p>{PASHTO_SECTION_KICKER}</p>
                <h2>{PASHTO_SECTION_TITLE}</h2>
              </div>
              <span className="public-section-count">{totalPosts}</span>
            </section>
          ) : null}

          {featured ? (
            <article id="featured-post" className={`post-featured${getPostImage(featured) ? '' : ' no-media'}`}>
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
                  <Link className="link link-more" to={`/post/${featured.slug}`}>
                    {PASHTO_READ_MORE} →
                  </Link>
                </div>
              </div>
              {getPostImage(featured) ? (
                <Link className="post-cover-link" to={`/post/${featured.slug}`}>
                  <img className="post-cover" src={resolveMediaUrl(getPostImage(featured))} alt={featured.title} />
                </Link>
              ) : null}
            </article>
          ) : null}

          {rest.length ? (
            <div className="public-grid">
              {rest.map((post, index) => {
                const image = getPostImage(post)
                return (
                  <article
                    key={post.id}
                    className="post-card"
                    style={{ '--delay': `${index * 50}ms` }}
                  >
                    {image ? (
                      <Link to={`/post/${post.slug}`}>
                        <img className="post-cover" src={resolveMediaUrl(image)} alt={post.title} />
                      </Link>
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
                    </div>
                  </article>
                )
              })}
            </div>
          ) : null}

          {totalPages > 1 ? (
            <div className="public-pagination">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  className={`pagination-link${page === currentPage ? ' active' : ''}`}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  disabled={page === currentPage}
                >
                  {page}
                </button>
              ))}
            </div>
          ) : null}
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
