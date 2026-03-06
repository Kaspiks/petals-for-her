import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import SearchBar from './SearchBar/index'

function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="font-serif text-2xl font-semibold text-[#D4A5A5]">Petals</span>
            <span className="font-sans text-xl font-medium text-stone-600">for Her</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition">Shop</Link>
            <Link to="/#collections" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition">Collections</Link>
            <Link to="/#process" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition">Our Process</Link>
            <Link to="/#gifts" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition">Gifts</Link>
          </nav>

          {/* Search & icons */}
          <div className="flex items-center gap-4 flex-1 justify-end min-w-0">
            <div className="hidden sm:flex items-center min-w-0 w-48 lg:w-64">
              <SearchBar
                onSelect={(item) => {
                  if (item.type === 'collection') {
                    navigate(`/products${item.id ? `?collection=${item.id}` : ''}`)
                  } else {
                    navigate(`/product/${item.slug ?? item.id}`)
                  }
                }}
              />
            </div>
            <button className="p-2 text-stone-600 hover:text-stone-900 transition" aria-label="Cart">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                {user.admin && (
                  <Link
                    to="/admin"
                    className="p-2 text-stone-600 hover:text-stone-900 transition text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-sm text-stone-600 hidden sm:inline">{user.full_name}</span>
                <button
                  onClick={() => logout()}
                  className="p-2 text-stone-600 hover:text-stone-900 transition text-sm"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 p-2 text-stone-600 hover:text-stone-900 transition text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
