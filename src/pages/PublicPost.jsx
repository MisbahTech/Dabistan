import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import PublicFooter from '../components/PublicFooter'
import PublicHeader from '../components/PublicHeader'
import { usePublicCategoriesQuery } from '../services/publicCategoriesApi'
import { usePublicPostQuery } from '../services/publicPostsApi'
import { getPostAttachment, getPostGallery, getPostImage, resolveMediaUrl } from '../utils/postMedia'

const EMPTY_LIST = []

const PASHTO_NO_INFO = '\u0646\u0648\u0631 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0646\u0634\u062A\u0647'
const PASHTO_LOADING = '\u0644\u06CC\u06A9\u0646\u0647 \u0644\u0648\u0689\u06D0\u0696\u064A...'
const PASHTO_ATTACHMENT = '\u0636\u0645\u06CC\u0645\u0647:'
const PASHTO_NO_FILE_NAME = '\u062F \u0641\u0627\u06CC\u0644 \u0646\u0648\u0645 \u0646\u0634\u062A\u0647'

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

export default function PublicPost() {
  const { slug } = useParams()
  const postQuery = usePublicPostQuery(slug)
  const categoriesQuery = usePublicCategoriesQuery()

  const post = postQuery.data ?? null
  const categories = categoriesQuery.data ?? EMPTY_LIST
  const error = postQuery.error?.message || categoriesQuery.error?.message || ''
  const galleryImages = useMemo(() => getPostGallery(post), [post])
  const attachment = getPostAttachment(post)

  const meta = useMemo(() => {
    if (!post) return ''
    return getPublishedAt(post) ? formatDate(getPublishedAt(post)) : ''
  }, [post])

  const categoryLabel = useMemo(() => {
    const map = new Map(categories.map((cat) => [cat.slug, cat.name]))
    return (value) => map.get(value) ?? value
  }, [categories])

  return (
    <div className="public-shell" dir="rtl">
      <PublicHeader categories={categories} activeCategory={post?.category ?? ''} showBackLink />

      <main className="public-main">
        <section className="public-content public-container">
          <section className="public-hero compact">
            <div>
              <h1>{post?.title || '-'}</h1>
              <p className="public-subtitle">{meta || PASHTO_NO_INFO}</p>
            </div>
          </section>

          {postQuery.isLoading ? <div className="muted">{PASHTO_LOADING}</div> : null}
          {error ? <div className="alert error">{error}</div> : null}

          {post ? (
            <article className="post-detail">
              {getPostImage(post) ? (
                <img className="post-cover detail" src={resolveMediaUrl(getPostImage(post))} alt={post.title} />
              ) : null}
              <div className="post-body">
                {post.category ? <span className="tag">{categoryLabel(post.category)}</span> : null}
                <h2 className="post-title">{post.title}</h2>
                {meta ? <p className="post-meta">{meta}</p> : null}
                <div className="post-content">{post.content}</div>
                {galleryImages.length > 1 ? (
                  <div className="post-gallery">
                    {galleryImages.map((imageUrl) => (
                      <img key={imageUrl} src={resolveMediaUrl(imageUrl)} alt={post.title} />
                    ))}
                  </div>
                ) : null}
                {attachment?.url ? (
                  <div className="post-attachment">
                    <span>{PASHTO_ATTACHMENT}</span>
                    <div className="post-attachment-actions">
                      <a className="link" href={resolveMediaUrl(attachment.url)} target="_blank" rel="noreferrer">
                        {attachment.originalName || attachment.name || PASHTO_NO_FILE_NAME}
                      </a>
                      <a
                        className="btn primary"
                        href={resolveMediaUrl(attachment.url)}
                        download={attachment.originalName || attachment.name || 'document.pdf'}
                      >
                        Download PDF
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
          ) : null}
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
