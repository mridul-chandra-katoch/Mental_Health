import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem('tokenUser');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('tokenUser');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:4000/delete-user/${user}`, { method: 'DELETE' });
      localStorage.removeItem('token');
      localStorage.removeItem('tokenUser');
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const navLinks = [
    { name: 'Mood Tracker', href: `/${user}/mood`, emoji: '📊' },
    { name: 'AI Therapist', href: `/${user}/therapist`, emoji: '🤖' },
    { name: 'Quiz', href: `/${user}/quiz`, emoji: '📝' },
    { name: 'Anonymous', href: `/${user}/anonymoussharing`, emoji: '💬' },
    { name: 'About Us', href: '/aboutus', emoji: '👥' },
  ];

  return (
    <div className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-sm shadow-md'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-purple-300 transition-all duration-300">
              <span className="text-white text-lg">🧠</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Mindfulness</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200">
                <span>{link.emoji}</span>
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center">
            {isLoggedIn ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 hover:border-purple-300 transition-all duration-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user}</span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800">{user}</p>
                    </div>
                    <a href={`/${user}/profile`} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                      <span>👤</span> Your Profile
                    </a>
                    <a href={`/${user}/readjournals`} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                      <span>📓</span> My Journals
                    </a>
                    <div className="border-t border-gray-100">
                      <a onClick={handleLogout} href="#" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        <span>🚪</span> Sign out
                      </a>
                      <a onClick={() => setShowDeleteModal(true)} href="#" className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <span>🗑️</span> Delete Account
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="/login" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">Login</a>
                <a href="/signup" className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-200 transition-all duration-200">
                  Get Started
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all">
                  <span>{link.emoji}</span>{link.name}
                </a>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              {isLoggedIn ? (
                <div className="space-y-1">
                  <a href={`/${user}/profile`} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-purple-50">👤 Profile</a>
                  <a onClick={handleLogout} href="#" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50">🚪 Sign out</a>
                  <a onClick={() => setShowDeleteModal(true)} href="#" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50">🗑️ Delete Account</a>
                </div>
              ) : (
                <div className="flex gap-3 px-3">
                  <a href="/login" className="flex-1 text-center py-2 rounded-lg border border-purple-200 text-purple-600 text-sm font-medium">Login</a>
                  <a href="/signup" className="flex-1 text-center py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium">Sign Up</a>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="text-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone. All your data will be permanently deleted.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
