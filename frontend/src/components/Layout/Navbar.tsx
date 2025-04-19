import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { CheckSquare, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <CheckSquare className="h-6 w-6 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TaskMaster</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-500">Welcome,</span>{' '}
                  <span className="font-medium text-gray-900">
                    {user?.fullName || user?.email?.split('@')[0]}
                  </span>
                </div>
                
                <div className="relative ml-3 flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<User className="h-4 w-4" />}
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<LogOut className="h-4 w-4" />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;