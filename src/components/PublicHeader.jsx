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
} from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import siteLogo from '../assets/logo.png'

const BRAND_NAME = '\u062F\u0628\u0633\u062A\u0627\u0646'
const DEFAULT_BRAND_TAG = '\u0641\u0631\u0647\u0646\u06AB\u064A \u0645\u0631\u06A9\u0632'
const BACK_TO_LIST = '\u0628\u06D0\u0631\u062A\u0647 \u0644\u06CC\u0633\u062A \u062A\u0647'
const ALL_LABEL = '\u067C\u0648\u0644'
const BOOKS_LABEL = '\u06A9\u062A\u0627\u0628\u0648\u0646\u0647'
const ALL_BOOKS_LABEL = '\u067C\u0648\u0644 \u06A9\u062A\u0627\u0628\u0648\u0646\u0647'
const CARET = '\u25BE'
const CONFERENCES_LABEL = '\u06A9\u0646\u0641\u0631\u0627\u0646\u0633\u0648\u0646\u0647'
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
  '\u0633\u06CC\u0631\u062A \u0627\u0644\u0646\u0628\u064A \u06A9\u0627\u0646\u0641\u0631\u0627\u0646\u0633': {
    '--menu-icon-from': '#e0f2fe',
    '--menu-icon-to': '#bae6fd',
    '--menu-icon-fg': '#075985',
  },
  '\u0627\u062F\u0628\u064A \u06A9\u0627\u0646\u0641\u0631\u0627\u0646\u0633': {
    '--menu-icon-from': '#f5d0fe',
    '--menu-icon-to': '#f0abfc',
    '--menu-icon-fg': '#a21caf',
  },
  '\u0639\u0644\u0645\u06CC \u06A9\u0646\u0641\u0631\u0627\u0646\u0633': {
    '--menu-icon-from': '#dcfce7',
    '--menu-icon-to': '#bbf7d0',
    '--menu-icon-fg': '#15803d',
  },
  '\u0641\u0631\u0647\u0646\u06AB\u064A \u06A9\u0646\u0641\u0631\u0627\u0646\u0633': {
    '--menu-icon-from': '#fde68a',
    '--menu-icon-to': '#fcd34d',
    '--menu-icon-fg': '#b45309',
  },
}

function renderMenuIcon(label) {
  const Icon = MENU_ICON_MAP[label] ?? CircleDot
  const iconStyle =
    MENU_ICON_STYLE_MAP[label] ??
    (label.includes('\u06A9\u0646\u0641\u0631\u0627\u0646\u0633') || label.includes('\u06A9\u0627\u0646\u0641\u0631\u0627\u0646\u0633')
      ? MENU_ICON_STYLE_MAP[CONFERENCES_LABEL]
      : label.includes('\u06A9\u062A\u0627\u0628')
        ? MENU_ICON_STYLE_MAP[BOOKS_LABEL]
        : null)

  return (
    <span className="menu-icon" aria-hidden="true" style={iconStyle}>
      <Icon size={15} strokeWidth={1.9} />
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

export default function PublicHeader({
  categories = [],
  activeCategory = '',
  searchValue = '',
  brandTag = DEFAULT_BRAND_TAG,
  showBackLink = false,
}) {
  const hasActions = showBackLink

  const { mainItems, books, bookItems, conferenceItems, otherItems } = useMemo(() => {
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

  const bookSlugs = useMemo(() => new Set(bookItems.map((item) => item.slug)), [bookItems])
  const isBooksActive = (books && activeCategory === books.slug) || bookSlugs.has(activeCategory)
  const conferenceSlugs = useMemo(() => new Set(conferenceItems.map((item) => item.slug)), [conferenceItems])
  const isConferencesActive = conferenceSlugs.has(activeCategory)

  return (
    <>
      <header className="public-header">
        <div className="public-container public-header-inner">
          <div className={`public-brand${hasActions ? ' has-actions' : ''}`}>
            <img src={siteLogo} alt={BRAND_NAME} />
            <div className="public-brand-text">
              <span className="public-brand-mark">{BRAND_NAME}</span>
              <span className="public-brand-tag">{brandTag}</span>
            </div>
          </div>

          {hasActions ? (
            <div className="public-nav-actions">
              {showBackLink ? (
                <Link className="btn ghost" to="/">
                  {BACK_TO_LIST}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      <nav className="public-menu-wrap">
        <div className="public-container">
          <div className="public-menu" role="navigation" aria-label="main menu">
            <Link className={`menu-link${activeCategory ? '' : ' active'}`} to={buildLink('', searchValue)}>
              {renderMenuIcon(ALL_LABEL)}
              <span className="menu-text">{ALL_LABEL}</span>
            </Link>

            {mainItems.map((item) => (
              <Link
                key={item.id}
                className={`menu-link${activeCategory === item.slug ? ' active' : ''}`}
                to={buildLink(item.slug, searchValue)}
              >
                {renderMenuIcon(item.name)}
                <span className="menu-text">{item.name}</span>
              </Link>
            ))}

            <details className={`menu-group${isConferencesActive ? ' active' : ''}`}>
              <summary className="menu-link">
                {renderMenuIcon(CONFERENCES_LABEL)}
                <span className="menu-text">{CONFERENCES_LABEL}</span>
                <span className="caret">{CARET}</span>
              </summary>
              <div className="menu-dropdown">
                {conferenceItems.map((item) => (
                  <Link
                    key={item.id ?? item.slug}
                    className={`menu-item${activeCategory === item.slug ? ' active' : ''}`}
                    to={buildLink(item.slug, searchValue)}
                  >
                    {renderMenuIcon(item.name)}
                    <span className="menu-text">{item.name}</span>
                  </Link>
                ))}
              </div>
            </details>

            {books ? (
              <details className={`menu-group${isBooksActive ? ' active' : ''}`}>
                <summary className="menu-link">
                  {renderMenuIcon(BOOKS_LABEL)}
                  <span className="menu-text">{BOOKS_LABEL}</span>
                  <span className="caret">{CARET}</span>
                </summary>
                <div className="menu-dropdown">
                  <Link
                    className={`menu-item${activeCategory === books.slug ? ' active' : ''}`}
                    to={buildLink(books.slug, searchValue)}
                  >
                    {renderMenuIcon(ALL_BOOKS_LABEL)}
                    <span className="menu-text">{ALL_BOOKS_LABEL}</span>
                  </Link>

                  {bookItems.map((item) => (
                    <Link
                      key={item.id}
                      className={`menu-item${activeCategory === item.slug ? ' active' : ''}`}
                      to={buildLink(item.slug, searchValue)}
                    >
                      {renderMenuIcon(item.name)}
                      <span className="menu-text">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </details>
            ) : null}

            {otherItems.map((item) => (
              <Link
                key={item.id}
                className={`menu-link${activeCategory === item.slug ? ' active' : ''}`}
                to={buildLink(item.slug, searchValue)}
              >
                {renderMenuIcon(item.name)}
                <span className="menu-text">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
