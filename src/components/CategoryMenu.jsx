import {
  BookOpen,
  Bookmark,
  CircleDot,
  FlaskConical,
  Home,
  Library,
  Mic2,
  Newspaper,
  PenSquare,
  Presentation,
  ChevronDown,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'

const ALL_LABEL = '\u067C\u0648\u0644'
const BOOKS_LABEL = '\u06A9\u062A\u0627\u0628\u0648\u0646\u0647'
const ALL_BOOKS_LABEL = '\u067C\u0648\u0644 \u06A9\u062A\u0627\u0628\u0648\u0646\u0647'
const CARET = '\u25BE'
const CONFERENCES_LABEL = '\u06A9\u0646\u0641\u0631\u0627\u0646\u0633\u0648\u0646\u0647'
const MORE_LABEL = '\u0646\u0648\u0631'
const HIDDEN_MENU_NAMES = new Set(['\u062F \u0633\u06CC\u0631\u062A \u06A9\u0644\u0646\u06CC \u06A9\u0646\u0641\u0631\u0627\u0646\u0633'])
const HIDDEN_MENU_SLUGS = new Set(['seerat-conference'])

const CONFERENCE_MENU = [
  {
    label: '\u0633\u06CC\u0631\u062A \u0627\u0644\u0646\u0628\u064A \u06A9\u0627\u0646\u0641\u0631\u0627\u0646\u0633',
    slug: 'seerat-al-nabi-conference',
    names: ['\u0633\u06CC\u0631\u062A \u0627\u0644\u0646\u0628\u064A \u06A9\u0627\u0646\u0641\u0631\u0627\u0646\u0633'],
  },
  {
    label: '\u0627\u062F\u0628\u064A \u06A9\u0627\u0646\u0641\u0631\u0627\u0646\u0633',
    slug: 'adabi-conference',
    names: ['\u0627\u062F\u0628\u064A \u06A9\u0627\u0646\u0641\u0631\u0627\u0646\u0633'],
  },
  {
    label: '\u0639\u0644\u0645\u06CC \u06A9\u0646\u0641\u0631\u0627\u0646\u0633',
    slug: 'elmi-conference',
    names: ['\u0639\u0644\u0645\u06CC \u06A9\u0646\u0641\u0631\u0627\u0646\u0633', '\u0639\u0644\u0645\u06CC \u06A9\u0627\u0646\u0641\u0631\u0627\u0646\u0633'],
  },
  {
    label: '\u0641\u0631\u0647\u0646\u06AB\u064A \u06A9\u0646\u0641\u0631\u0627\u0646\u0633',
    slug: 'farhangi-conference',
    names: ['\u0641\u0631\u0647\u0646\u06AB\u064A \u06A9\u0646\u0641\u0631\u0627\u0646\u0633', '\u0641\u0631\u0647\u0646\u06AB\u064A \u06A9\u0627\u0646\u0641\u0631\u0627\u0646\u0633'],
  },
]

const MAIN_MENU_ORDER = [
  '\u062E\u0628\u0631\u0648\u0646\u0647',
  '\u0641\u0631\u0647\u0646\u06AB\u064A \u0644\u06CC\u06A9\u0646\u06D0',
  '\u0639\u0644\u0645\u064A \u0644\u06CC\u06A9\u0646\u06D0',
  '\u062F\u0628\u0633\u062A\u0627\u0646 \u0645\u062C\u0644\u0647',
  '\u062F\u0628\u0633\u062A\u0627\u0646 \u067E\u0627\u0689\u06A9\u0627\u0633\u067C',
  BOOKS_LABEL,
]

const BOOK_CHILDREN = [
  '\u062A\u0627\u0644\u064A\u0641',
  '\u0685\u06D0\u0693\u0646\u0647',
  '\u0698\u0628\u0627\u0693\u0647',
  '\u0645\u062E\u06A9\u062A\u0646\u0647',
  '\u0633\u062A\u0627\u06CC\u0646\u063A\u0648\u0646\u0689\u0647',
]

const MENU_ICON_MAP = {
  [ALL_LABEL]: Home,
  '\u062E\u0628\u0631\u0648\u0646\u0647': Newspaper,
  '\u0641\u0631\u0647\u0646\u06AB\u064A \u0644\u06CC\u06A9\u0646\u06D0': PenSquare,
  '\u0639\u0644\u0645\u064A \u0644\u06CC\u06A9\u0646\u06D0': FlaskConical,
  '\u062F\u0628\u0633\u062A\u0627\u0646 \u0645\u062C\u0644\u0647': Bookmark,
  '\u062F\u0628\u0633\u062A\u0627\u0646 \u067E\u0627\u0689\u06A9\u0627\u0633\u067C': Mic2,
  [CONFERENCES_LABEL]: Presentation,
  [BOOKS_LABEL]: Library,
  [ALL_BOOKS_LABEL]: BookOpen,
}

for (const item of CONFERENCE_MENU) {
  MENU_ICON_MAP[item.label] = Presentation
}

const MENU_ICON_STYLE_MAP = {
  [ALL_LABEL]: { '--menu-icon-from': '#dbeafe', '--menu-icon-to': '#bfdbfe', '--menu-icon-fg': '#1d4ed8' },
  '\u062E\u0628\u0631\u0648\u0646\u0647': {
    '--menu-icon-from': '#fee2e2',
    '--menu-icon-to': '#fecaca',
    '--menu-icon-fg': '#b91c1c',
  },
  '\u0641\u0631\u0647\u0646\u06AB\u064A \u0644\u06CC\u06A9\u0646\u06D0': {
    '--menu-icon-from': '#fae8ff',
    '--menu-icon-to': '#e9d5ff',
    '--menu-icon-fg': '#7e22ce',
  },
  '\u0639\u0644\u0645\u064A \u0644\u06CC\u06A9\u0646\u06D0': {
    '--menu-icon-from': '#dcfce7',
    '--menu-icon-to': '#bbf7d0',
    '--menu-icon-fg': '#15803d',
  },
  '\u062F\u0628\u0633\u062A\u0627\u0646 \u0645\u062C\u0644\u0647': {
    '--menu-icon-from': '#ffedd5',
    '--menu-icon-to': '#fed7aa',
    '--menu-icon-fg': '#c2410c',
  },
  '\u062F\u0628\u0633\u062A\u0627\u0646 \u067E\u0627\u0689\u06A9\u0627\u0633\u067C': {
    '--menu-icon-from': '#ede9fe',
    '--menu-icon-to': '#ddd6fe',
    '--menu-icon-fg': '#6d28d9',
  },
  [CONFERENCES_LABEL]: { '--menu-icon-from': '#cffafe', '--menu-icon-to': '#a5f3fc', '--menu-icon-fg': '#0f766e' },
  [BOOKS_LABEL]: { '--menu-icon-from': '#fef3c7', '--menu-icon-to': '#fde68a', '--menu-icon-fg': '#b45309' },
  [ALL_BOOKS_LABEL]: { '--menu-icon-from': '#e0f2fe', '--menu-icon-to': '#bae6fd', '--menu-icon-fg': '#0369a1' },
  '\u062A\u0627\u0644\u064A\u0641': { '--menu-icon-from': '#fce7f3', '--menu-icon-to': '#fbcfe8', '--menu-icon-fg': '#be185d' },
  '\u0685\u06D0\u0693\u0646\u0647': { '--menu-icon-from': '#ede9fe', '--menu-icon-to': '#ddd6fe', '--menu-icon-fg': '#5b21b6' },
  '\u0698\u0628\u0627\u0693\u0647': { '--menu-icon-from': '#ccfbf1', '--menu-icon-to': '#99f6e4', '--menu-icon-fg': '#0f766e' },
  '\u0645\u062E\u06A9\u062A\u0646\u0647': { '--menu-icon-from': '#ecfccb', '--menu-icon-to': '#d9f99d', '--menu-icon-fg': '#4d7c0f' },
  '\u0633\u062A\u0627\u06CC\u0646\u063A\u0648\u0646\u0689\u0647': {
    '--menu-icon-from': '#ffe4e6',
    '--menu-icon-to': '#fecdd3',
    '--menu-icon-fg': '#be123c',
  },
}

for (const item of CONFERENCE_MENU) {
  MENU_ICON_STYLE_MAP[item.label] = MENU_ICON_STYLE_MAP[CONFERENCES_LABEL]
}

function renderSidebarIcon(label) {
  const Icon = MENU_ICON_MAP[label] ?? CircleDot
  const iconStyle = MENU_ICON_STYLE_MAP[label] ?? null
  
  return (
    <span className="sidebar-icon" style={iconStyle}>
      <Icon size={16} strokeWidth={2.2} />
    </span>
  )
}

function buildLink(slug, searchValue) {
  const params = new URLSearchParams()
  if (searchValue) params.set('q', searchValue)
  if (slug) params.set('category', slug)
  const query = params.toString()
  return `/${query ? `?${query}` : ''}`
}

export default function CategoryMenu({ categories = [], activeCategory = '', searchValue = '' }) {
  const { mainItems, books, bookItems, conferenceItems, otherItems, moreItems } = useMemo(() => {
    const visibleCategories = categories.filter(
      (cat) => !HIDDEN_MENU_NAMES.has(cat.name) && !HIDDEN_MENU_SLUGS.has(cat.slug)
    )
    const byName = new Map(visibleCategories.map((cat) => [cat.name, cat]))
    const main = MAIN_MENU_ORDER.map((name) => byName.get(name)).filter(Boolean)
    const booksCategory = byName.get(BOOKS_LABEL)
    const booksChildren = BOOK_CHILDREN.map((name) => byName.get(name)).filter(Boolean)
    const conferenceNames = new Set(CONFERENCE_MENU.flatMap((item) => item.names))
    const usedNames = new Set([...MAIN_MENU_ORDER, ...BOOK_CHILDREN, ...conferenceNames, CONFERENCES_LABEL])
    const extra = visibleCategories.filter((cat) => !usedNames.has(cat.name))
    const conferenceItems = CONFERENCE_MENU.map((item) => {
      const found = item.names.map((name) => byName.get(name)).find(Boolean)
      return found ? { ...found, name: item.label } : { id: item.slug, slug: item.slug, name: item.label }
    })

    return {
      mainItems: main.filter((entry) => entry.name !== BOOKS_LABEL),
      books: booksCategory ?? null,
      bookItems: booksChildren,
      conferenceItems,
      otherItems: extra,
    }
  }, [categories])

  const conferenceSlugs = useMemo(() => new Set(conferenceItems.map((item) => item.slug)), [conferenceItems])
  const isConferencesActive = conferenceSlugs.has(activeCategory)
  const bookSlugs = useMemo(() => new Set(bookItems.map((item) => item.slug)), [bookItems])
  const isBooksActive = (books && activeCategory === books.slug) || bookSlugs.has(activeCategory)

  return (
    <nav className="sidebar-nav">
      <section className="sidebar-section">
        <Link className={`sidebar-link${!activeCategory ? ' active' : ''}`} to={buildLink('', searchValue)}>
          {renderSidebarIcon(ALL_LABEL)}
          <span>{ALL_LABEL}</span>
        </Link>
      </section>

      <section className="sidebar-section">
        <h4 className="sidebar-title">{'\u0628\u0627\u0628\u0648\u0646\u0647'}</h4>
        {mainItems.map((item) => (
          <Link
            key={item.id}
            className={`sidebar-link${activeCategory === item.slug ? ' active' : ''}`}
            to={buildLink(item.slug, searchValue)}
          >
            {renderSidebarIcon(item.name)}
            <span>{item.name}</span>
          </Link>
        ))}
      </section>

      <section className="sidebar-section">
        <h4 className="sidebar-title">{CONFERENCES_LABEL}</h4>
        {conferenceItems.map((item) => (
          <Link
            key={item.id ?? item.slug}
            className={`sidebar-link${activeCategory === item.slug ? ' active' : ''}`}
            to={buildLink(item.slug, searchValue)}
          >
            {renderSidebarIcon(item.name)}
            <span>{item.name}</span>
          </Link>
        ))}
      </section>

      {books ? (
        <section className="sidebar-section">
          <h4 className="sidebar-title">{BOOKS_LABEL}</h4>
          <Link
            className={`sidebar-link${activeCategory === books.slug ? ' active' : ''}`}
            to={buildLink(books.slug, searchValue)}
          >
            {renderSidebarIcon(ALL_BOOKS_LABEL)}
            <span>{ALL_BOOKS_LABEL}</span>
          </Link>
          {bookItems.map((item) => (
            <Link
              key={item.id}
              className={`sidebar-link${activeCategory === item.slug ? ' active' : ''}`}
              to={buildLink(item.slug, searchValue)}
            >
              {renderSidebarIcon(item.name)}
              <span>{item.name}</span>
            </Link>
          ))}
        </section>
      ) : null}

      {otherItems.length > 0 && (
        <section className="sidebar-section">
          <h4 className="sidebar-title">{MORE_LABEL}</h4>
          {otherItems.map((item) => (
            <Link
              key={item.id}
              className={`sidebar-link${activeCategory === item.slug ? ' active' : ''}`}
              to={buildLink(item.slug, searchValue)}
            >
              {renderSidebarIcon(item.name)}
              <span>{item.name}</span>
            </Link>
          ))}
        </section>
      )}
    </nav>
  )
}
