import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import AuthForm from '../components/AuthForm';
import { useAuthStore } from '../store/authStore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useAuthStore();
  
  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (isAuth) {
        navigate('/dashboard');
      }
    };
    
    verifyAuth();
  }, [checkAuth, navigate]);
  
  if (isAuthenticated) {
    return null; // Prevent flash of login page if already authenticated
  }
  
  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <AuthForm mode="login" />
      </div>
    </AppLayout>
  );
};

export default Login;