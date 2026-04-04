import {
  BookOpen,
  Bookmark,
  CircleDot,
  FlaskConical,
  Home,
  Library,
  Mic2,
  MoreHorizontal,
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
const MORE_LABEL = '\u0646\u0648\u0631'
const CARET = '\u25BE'

const CONFERENCES_LABEL = 'Conferences'

const CONFERENCE_MENU = [
  { name: 'سیرت النبي کانفرانس', slug: 'seerat-al-nabi-conference' },
  { name: 'ادبي کانفرانس', slug: 'adabi-conference' },
  { name: 'علمی کانفرانس', slug: 'elmi-conference' },
  { name: 'فرهنګي کانفرانس', slug: 'farhangi-conference' },
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
  [MORE_LABEL]: MoreHorizontal,
}

for (const { name } of CONFERENCE_MENU) {
  MENU_ICON_MAP[name] = Presentation
}

function renderMenuIcon(label) {
  const Icon = MENU_ICON_MAP[label] ?? CircleDot
  return (
    <span className="menu-icon" aria-hidden="true">
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
    const byName = new Map(categories.map((cat) => [cat.name, cat]))
    const main = MAIN_MENU_ORDER.map((name) => byName.get(name)).filter(Boolean)
    const booksCategory = byName.get(BOOKS_LABEL)
    const booksChildren = BOOK_CHILDREN.map((name) => byName.get(name)).filter(Boolean)

    const conferenceNames = CONFERENCE_MENU.map((c) => c.name)
    const usedNames = new Set([...MAIN_MENU_ORDER, ...BOOK_CHILDREN, ...conferenceNames])
    const extra = categories.filter((cat) => !usedNames.has(cat.name))

    const conferenceItems = CONFERENCE_MENU.map(({ name, slug }) => {
      const found = byName.get(name)
      return found ?? { id: slug, name, slug }
    })

    return {
      mainItems: main.filter((item) => item.name !== BOOKS_LABEL),
      books: booksCategory ?? null,
      bookItems: booksChildren,
      conferenceItems,
      otherItems: extra,
    }
  }, [categories])

  const bookSlugs = useMemo(() => new Set(bookItems.map((item) => item.slug)), [bookItems])
  const isBooksActive = (books && activeCategory === books.slug) || bookSlugs.has(activeCategory)

  const conferenceSlugs = useMemo(
    () => new Set(conferenceItems.map((item) => item.slug)),
    [conferenceItems]
  )
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

            {otherItems.length ? (
              <details className="menu-group">
                <summary className="menu-link">
                  {renderMenuIcon(MORE_LABEL)}
                  <span className="menu-text">{MORE_LABEL}</span>
                  <span className="caret">{CARET}</span>
                </summary>
                <div className="menu-dropdown">
                  {otherItems.map((item) => (
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
          </div>
        </div>
      </nav>
    </>
  )
}

