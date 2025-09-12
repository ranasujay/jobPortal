import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { 
  User, 
  LogOut, 
  Briefcase, 
  Heart, 
  PlusCircle,
  Menu,
  X 
} from 'lucide-react';
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Briefcase className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">JobPortal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/jobs" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Find Jobs
            </Link>
            {isAuthenticated && user?.role === 'recruiter' && (
              <Link 
                to="/companies" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Companies
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowLoginModal(true)}
                >
                  Sign In
                </Button>
                <Button onClick={() => setShowRegisterModal(true)}>
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                {user?.role === 'recruiter' && (
                  <Link to="/post-job">
                    <Button variant="default" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Post Job
                    </Button>
                  </Link>
                )}
                
                {/* User Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block">{user?.name}</span>
                  </Button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      
                      <div className="py-1">
                        {user?.role === 'recruiter' && (
                          <Link
                            to="/my-jobs"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Briefcase className="h-4 w-4 mr-3" />
                            My Jobs
                          </Link>
                        )}
                        
                        <Link
                          to="/saved-jobs"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Heart className="h-4 w-4 mr-3" />
                          Saved Jobs
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              <Link
                to="/jobs"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setShowMobileMenu(false)}
              >
                Find Jobs
              </Link>
              
              {isAuthenticated && user?.role === 'recruiter' && (
                <Link
                  to="/companies"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Companies
                </Link>
              )}

              {!isAuthenticated ? (
                <div className="space-y-2 pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setShowLoginModal(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setShowRegisterModal(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                <div className="pt-4 space-y-1">
                  {user?.role === 'recruiter' && (
                    <>
                      <Link
                        to="/post-job"
                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Post Job
                      </Link>
                      <Link
                        to="/my-jobs"
                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        My Jobs
                      </Link>
                    </>
                  )}
                  
                  <Link
                    to="/saved-jobs"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Saved Jobs
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
    </header>
  );
};

export default Header;