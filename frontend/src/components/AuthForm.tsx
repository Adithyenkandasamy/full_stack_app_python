import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './ui/Input';
import Button from './ui/Button';
import { useAuthStore } from '../store/authStore';

interface AuthFormProps {
  mode: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { loginUser, registerUser, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
      fullName: '',
    };
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    // Full name validation (only for register)
    if (mode === 'register' && !fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    }
    
    setFormErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'login') {
        await loginUser(email, password);
      } else {
        await registerUser(email, password, fullName);
      }
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        {mode === 'login' ? 'Sign In to Your Account' : 'Create Your Account'}
      </h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <Input
            label="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={formErrors.fullName}
            fullWidth
            placeholder="John Doe"
          />
        )}
        
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={formErrors.email}
          fullWidth
          placeholder="john@example.com"
        />
        
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={formErrors.password}
          fullWidth
          placeholder="••••••••"
        />
        
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          className="mt-6"
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          {mode === 'login' 
            ? "Don't have an account? " 
            : "Already have an account? "}
          <button
            onClick={() => navigate(mode === 'login' ? '/register' : '/login')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {mode === 'login' ? 'Sign up now' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;