const normalizeContentItem = (item = {}) => ({
  ...item,
  articles: item.articles ?? [],
  gallery: item.gallery ?? [],
  videos: item.videos ?? [],
  links: item.links ?? [],
})

// Connection: create a route descriptor that ties a slug to its content.
const buildCollectionRoute = (collectionKey, basePath, item) => {
  const safeItem = normalizeContentItem(item)
  const path = basePath ? `${basePath}/${safeItem.slug}` : `/${safeItem.slug}`

  return {
    key: `${collectionKey}-${safeItem.slug}`,
    path,
    type: 'content',
    content: safeItem,
  }
}

// Connection: build the routing table for sections and books.
export const buildAppRoutes = (sections = [], books = []) => {
  const sectionRoutes = sections.map((item) => buildCollectionRoute('sections', '', item))
  const bookRoutes = books.map((item) => buildCollectionRoute('books', '/books', item))

  return [
    { key: 'home', path: '/', type: 'home' },
    ...sectionRoutes,
    { key: 'books-home', path: '/books', type: 'books-home' },
    ...bookRoutes,
    { key: 'not-found', path: '*', type: 'not-found' },
  ]
}

// Connection: build nav chips from section metadata.
export const buildNavLinks = (sections = []) => [
  { key: 'home', path: '/', label: 'کورپاڼه' },
  ...sections.map((section) => ({
    key: `nav-${section.slug}`,
    path: `/${section.slug}`,
    label: section.title,
  })),
  { key: 'books', path: '/books', label: 'کتابونه' },
]
