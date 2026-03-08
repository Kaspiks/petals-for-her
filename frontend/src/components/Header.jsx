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
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <svg className="w-7 h-7 text-[#E8365D]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-2xl font-semibold text-[#E8365D]">Petals</span>
              <span className="font-sans text-xl font-medium text-stone-600">for Her</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-sm font-medium text-stone-600 hover:text-[#E8365D] transition">Shop</Link>
            <Link to="/collections" className="text-sm font-medium text-stone-600 hover:text-[#E8365D] transition">Collections</Link>
            <Link to="/occasions" className="text-sm font-medium text-stone-600 hover:text-[#E8365D] transition">Occasions</Link>
            <Link to="/#our-story" className="text-sm font-medium text-stone-600 hover:text-[#E8365D] transition">About</Link>
          </nav>

          <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
            <div className="hidden sm:flex items-center min-w-0 w-48 lg:w-64">
              <SearchBar
                className="[&>div]:bg-[#E8365D]/10 [&>div]:border [&>div]:border-[#E8365D]/20"
                onSelect={(item) => {
                  if (item.type === 'collection') {
                    navigate(`/products${item.id ? `?collection=${item.id}` : ''}`)
                  } else {
                    navigate(`/product/${item.slug ?? item.id}`)
                  }
                }}
              />
            </div>

            <button className="p-2 text-stone-500 hover:text-[#E8365D] transition" aria-label="Cart">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {user.admin && (
                  <Link
                    to="/admin"
                    className="p-2 text-stone-500 hover:text-[#E8365D] transition text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-sm text-stone-500 hidden sm:inline">{user.full_name}</span>
                <button
                  onClick={() => logout()}
                  className="p-2 text-stone-500 hover:text-[#E8365D] transition text-sm"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 p-2 text-stone-500 hover:text-[#E8365D] transition text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
