import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../state/authStore';

function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Business Listing
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto md:mx-0">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>

          <nav className="flex items-center gap-4">
            <Link
              to="/listings"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Categories
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/cart"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  🛒 Cart
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

