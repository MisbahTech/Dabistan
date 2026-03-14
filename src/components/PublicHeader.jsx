import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import siteLogo from '../assets/logo.png'

const MAIN_MENU_ORDER = [
  'خبرونه',
  'فرهنګي لیکنې',
  'علمي لیکنې',
  'دبستان مجله',
  'دبستان پاډکاسټ',
  'د سیرت کلنی کنفرانس',
  'کتابونه',
]

const BOOK_CHILDREN = ['تاليف', 'څېړنه', 'ژباړه', 'مخکتنه', 'ستاینغونډه']

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
  onSearchChange,
  brandTag = 'دبستان مجله',
  showSearch = false,
  showBackLink = false,
  showLogin = true,
}) {
  const hasActions = showSearch || showBackLink || showLogin
  const { mainItems, books, bookItems, otherItems } = useMemo(() => {
    const byName = new Map(categories.map((cat) => [cat.name, cat]))
    const main = MAIN_MENU_ORDER.map((name) => byName.get(name)).filter(Boolean)
    const booksCategory = byName.get('کتابونه')
    const booksChildren = BOOK_CHILDREN.map((name) => byName.get(name)).filter(Boolean)

    const usedNames = new Set([
      ...MAIN_MENU_ORDER,
      ...BOOK_CHILDREN,
    ])
    const extra = categories.filter((cat) => !usedNames.has(cat.name))

    return {
      mainItems: main.filter((item) => item.name !== 'کتابونه'),
      books: booksCategory ?? null,
      bookItems: booksChildren,
      otherItems: extra,
    }
  }, [categories])

  const bookSlugs = useMemo(() => new Set(bookItems.map((item) => item.slug)), [bookItems])
  const isBooksActive =
    (books && activeCategory === books.slug) || bookSlugs.has(activeCategory)

  return (
    <>
      <header className="public-nav">
        <div className="public-brand">
          <img src={siteLogo} alt="دبستان" />
          <div className="public-brand-text">
            <span className="public-brand-mark">دبستان</span>
            <span className="public-brand-tag">{brandTag}</span>
          </div>
        </div>
        {hasActions ? (
          <div className="public-nav-actions">
            {showSearch ? (
              <input
                type="search"
                placeholder="لټون..."
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
              />
            ) : null}
            {showBackLink ? (
              <Link className="btn ghost" to="/">
                بېرته لېست ته
              </Link>
            ) : null}
            {showLogin ? (
              <Link className="btn ghost" to="/login">
                د اډمین ننوتل
              </Link>
            ) : null}
          </div>
        ) : null}
      </header>

      <nav className="public-menu">
        <Link
          className={`menu-link${activeCategory ? '' : ' active'}`}
          to={buildLink('', searchValue)}
        >
          ټول
        </Link>
        {mainItems.map((item) => (
          <Link
            key={item.id}
            className={`menu-link${activeCategory === item.slug ? ' active' : ''}`}
            to={buildLink(item.slug, searchValue)}
          >
            {item.name}
          </Link>
        ))}
        {books ? (
          <details className={`menu-group${isBooksActive ? ' active' : ''}`}>
            <summary className="menu-link">
              کتابونه
              <span className="caret">▾</span>
            </summary>
            <div className="menu-dropdown">
              <Link
                className={`menu-item${activeCategory === books.slug ? ' active' : ''}`}
                to={buildLink(books.slug, searchValue)}
              >
                ټول کتابونه
              </Link>
              {bookItems.map((item) => (
                <Link
                  key={item.id}
                  className={`menu-item${activeCategory === item.slug ? ' active' : ''}`}
                  to={buildLink(item.slug, searchValue)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </details>
        ) : null}
        {otherItems.length ? (
          <details className="menu-group">
            <summary className="menu-link">
              نور
              <span className="caret">▾</span>
            </summary>
            <div className="menu-dropdown">
              {otherItems.map((item) => (
                <Link
                  key={item.id}
                  className={`menu-item${activeCategory === item.slug ? ' active' : ''}`}
                  to={buildLink(item.slug, searchValue)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </details>
        ) : null}
      </nav>
    </>
  )
}
