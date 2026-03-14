import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from '../config/env.js'
import { getCollection } from '../db/connection.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const seedPath = path.resolve(__dirname, '../data/content.seed.json')

let seedCache = null

async function loadSeed() {
  if (seedCache) {
    return seedCache
  }

  const raw = await readFile(seedPath, 'utf8')
  const sanitized = raw.replace(/^\uFEFF/, '')
  seedCache = JSON.parse(sanitized)

  return seedCache
}

const hasDatabase = () => Boolean(env.databaseUrl)

const mapContentRow = (row, { articles = [], images = [], videos = [], links = [] }) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  description: row.description,
  articles,
  gallery: images,
  videos,
  links,
})

const groupBySlug = (rows = []) =>
  rows.reduce((acc, row) => {
    const key = row.section_slug
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(row)
    return acc
  }, {})

async function fetchContentGroups() {
  const [sections, books, articles, media, links] = await Promise.all([
    (await getCollection('sections'))
      .find({})
      .sort({ id: 1 })
      .project({ _id: 0, id: 1, slug: 1, title: 1, description: 1 })
      .toArray(),
    (await getCollection('books'))
      .find({})
      .sort({ id: 1 })
      .project({ _id: 0, id: 1, slug: 1, title: 1, description: 1 })
      .toArray(),
    (await getCollection('articles'))
      .find({})
      .sort({ id: 1 })
      .project({ _id: 0, id: 1, section_slug: 1, title: 1, excerpt: 1, href: 1 })
      .toArray(),
    (await getCollection('media_items'))
      .find({})
      .sort({ id: 1 })
      .project({ _id: 0, id: 1, section_slug: 1, media_type: 1, title: 1, url: 1, duration: 1, text: 1 })
      .toArray(),
    (await getCollection('links'))
      .find({})
      .sort({ id: 1 })
      .project({ _id: 0, id: 1, section_slug: 1, label: 1, href: 1 })
      .toArray(),
  ])

  const articlesBySlug = groupBySlug(articles)
  const linksBySlug = groupBySlug(links)

  const imagesBySlug = {}
  const videosBySlug = {}

  for (const item of media) {
    const target = item.media_type === 'image' ? imagesBySlug : videosBySlug
    if (!target[item.section_slug]) {
      target[item.section_slug] = []
    }

    target[item.section_slug].push({
      id: item.id,
      title: item.title,
      url: item.url,
      duration: item.duration,
      text: item.text,
    })
  }

  const sectionsResult = sections.map((row) =>
    mapContentRow(row, {
      articles: articlesBySlug[row.slug] ?? [],
      images: imagesBySlug[row.slug] ?? [],
      videos: videosBySlug[row.slug] ?? [],
      links: linksBySlug[row.slug] ?? [],
    })
  )

  const booksResult = books.map((row) =>
    mapContentRow(row, {
      articles: articlesBySlug[row.slug] ?? [],
      images: imagesBySlug[row.slug] ?? [],
      videos: videosBySlug[row.slug] ?? [],
      links: linksBySlug[row.slug] ?? [],
    })
  )

  return { sections: sectionsResult, books: booksResult }
}

async function fetchContentBySlug(slug) {
  const [articles, media, links] = await Promise.all([
    (await getCollection('articles'))
      .find({ section_slug: slug })
      .sort({ id: 1 })
      .project({ _id: 0, id: 1, section_slug: 1, title: 1, excerpt: 1, href: 1 })
      .toArray(),
    (await getCollection('media_items'))
      .find({ section_slug: slug })
      .sort({ id: 1 })
      .project({ _id: 0, id: 1, section_slug: 1, media_type: 1, title: 1, url: 1, duration: 1, text: 1 })
      .toArray(),
    (await getCollection('links'))
      .find({ section_slug: slug })
      .sort({ id: 1 })
      .project({ _id: 0, id: 1, section_slug: 1, label: 1, href: 1 })
      .toArray(),
  ])

  const images = []
  const videos = []

  for (const item of media) {
    const target = item.media_type === 'image' ? images : videos
    target.push({
      id: item.id,
      title: item.title,
      url: item.url,
      duration: item.duration,
      text: item.text,
    })
  }

  return {
    articles,
    images,
    videos,
    links,
  }
}

async function fetchNavLinksFromDb() {
  const result = await (await getCollection('nav_links'))
    .find({})
    .sort({ sort_order: 1, id: 1 })
    .project({ _id: 0, nav_key: 1, path: 1, label: 1 })
    .toArray()

  return result.map((row) => ({
    key: row.nav_key,
    path: row.path,
    label: row.label,
  }))
}

async function fetchContactsFromDb() {
  const result = await (await getCollection('contacts'))
    .find({})
    .sort({ sort_order: 1, created_at: 1 })
    .project({ _id: 0, id: 1, label: 1, href: 1 })
    .toArray()

  return result.map((row) => ({
    id: row.id,
    label: row.label,
    href: row.href,
  }))
}

export const contentRepository = {
  async fetchSections() {
    if (!hasDatabase()) {
      const seed = await loadSeed()
      return seed.sections ?? []
    }

    const { sections } = await fetchContentGroups()
    return sections
  },

  async fetchSectionBySlug(slug) {
    if (!hasDatabase()) {
      const seed = await loadSeed()
      return (seed.sections ?? []).find((item) => item.slug === slug) ?? null
    }

    const section = await (await getCollection('sections')).findOne(
      { slug },
      { projection: { _id: 0, id: 1, slug: 1, title: 1, description: 1 } }
    )

    if (!section) {
      return null
    }

    const related = await fetchContentBySlug(slug)

    return mapContentRow(section, {
      articles: related.articles,
      images: related.images,
      videos: related.videos,
      links: related.links,
    })
  },

  async fetchBooks() {
    if (!hasDatabase()) {
      const seed = await loadSeed()
      return seed.books ?? []
    }

    const { books } = await fetchContentGroups()
    return books
  },

  async fetchBookBySlug(slug) {
    if (!hasDatabase()) {
      const seed = await loadSeed()
      return (seed.books ?? []).find((item) => item.slug === slug) ?? null
    }

    const book = await (await getCollection('books')).findOne(
      { slug },
      { projection: { _id: 0, id: 1, slug: 1, title: 1, description: 1 } }
    )

    if (!book) {
      return null
    }

    const related = await fetchContentBySlug(slug)

    return mapContentRow(book, {
      articles: related.articles,
      images: related.images,
      videos: related.videos,
      links: related.links,
    })
  },

  async fetchNavLinks() {
    if (!hasDatabase()) {
      const seed = await loadSeed()
      return seed.nav ?? []
    }

    return fetchNavLinksFromDb()
  },

  async fetchContacts() {
    if (!hasDatabase()) {
      const seed = await loadSeed()
      return seed.contacts ?? []
    }

    return fetchContactsFromDb()
  },

  async fetchContentBundle() {
    if (!hasDatabase()) {
      const seed = await loadSeed()

      return {
        sections: seed.sections ?? [],
        books: seed.books ?? [],
        nav: seed.nav ?? [],
        contacts: seed.contacts ?? [],
      }
    }

    const [bundle, nav, contacts] = await Promise.all([
      fetchContentGroups(),
      fetchNavLinksFromDb(),
      fetchContactsFromDb(),
    ])

    return {
      sections: bundle.sections,
      books: bundle.books,
      nav,
      contacts,
    }
  },
}
