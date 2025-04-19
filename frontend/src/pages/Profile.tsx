import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { updateUserProfile } from '../lib/api';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, checkAuth, isAuthenticated } = useAuthStore();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        navigate('/login');
      } else if (user) {
        setFullName(user.fullName || '');
        setEmail(user.email || '');
      }
    };
    
    verifyAuth();
  }, [checkAuth, navigate, user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updateUserProfile({ fullName });
      toast.success('Profile updated successfully!');
      setIsSubmitting(false);
    } catch (error) {
      toast.error('Failed to update profile');
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-primary-50">
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your account details here.
            </p>
          </div>
          
          <div className="flex justify-center py-8">
            <div className="relative h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              disabled
              fullWidth
              className="bg-gray-50"
            />
            
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              placeholder="Your full name"
            />
            
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="mr-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Save Changes
              </Button>
            </div>
          </form>
          
          <div className="bg-gray-50 px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Account Security</h3>
            <p className="text-sm text-gray-500 mb-4">
              Manage your password and account security settings.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.error('This feature is not implemented yet')}
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;