import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TaskMaster. All rights reserved.
          </p>
        </div>
      </footer>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          },
          duration: 3000,
        }}
      />
    </div>
  );
};

export default AppLayout;