import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PublicFooter from '../components/PublicFooter'
import PublicHeader from '../components/PublicHeader'
import { usePublicCategoriesQuery } from '../services/publicCategoriesApi'
import { usePublicPostsQuery } from '../services/publicPostsApi'
import { getPostGallery, resolveMediaUrl } from '../utils/postMedia'

const EMPTY_LIST = []
const PAGE_SIZE = 200

export default function Gallery() {
  const postsQuery = usePublicPostsQuery({ page: 1, pageSize: PAGE_SIZE })
  const categoriesQuery = usePublicCategoriesQuery()

  const postsResponse = postsQuery.data
  const posts = postsResponse?.data ?? postsResponse ?? EMPTY_LIST
  const categories = categoriesQuery.data ?? EMPTY_LIST
  const error = postsQuery.error?.message || categoriesQuery.error?.message || ''

  const categoryLabel = useMemo(() => {
    const map = new Map(categories.map((cat) => [cat.slug, cat.name]))
    return (slug) => map.get(slug) ?? slug
  }, [categories])

  const images = useMemo(
    () =>
      posts.flatMap((post) =>
        getPostGallery(post).map((url, index) => ({
          id: `${post.slug}-${index}-${url}`,
          url,
          title: post.title,
          slug: post.slug,
          category: post.category,
        }))
      ),
    [posts]
  )

  return (
    <div className="public-shell" dir="rtl">
      <PublicHeader categories={categories} activePage="gallery" showBackLink />

      <main className="public-main">
        <section className="public-content public-container">
          <section className="public-showcase compact">
            <div className="public-showcase-copy">
              <h1>Gallery</h1>
              <p className="public-showcase-text">All uploaded post images appear here.</p>
            </div>
          </section>

          {error ? <div className="alert error">{error}</div> : null}
          {postsQuery.isLoading ? <div className="muted">Loading gallery...</div> : null}
          {!postsQuery.isLoading && images.length === 0 ? <div className="muted">No images yet.</div> : null}

          <div className="gallery-page-grid">
            {images.map((item) => (
              <Link key={item.id} className="gallery-card" to={`/post/${item.slug}`}>
                <img src={resolveMediaUrl(item.url)} alt={item.title} />
                <div className="gallery-card-body">
                  <strong>{item.title}</strong>
                  <span>{item.category ? categoryLabel(item.category) : ''}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
