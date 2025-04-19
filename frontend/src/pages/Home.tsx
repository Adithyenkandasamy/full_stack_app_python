import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AppLayout from '../components/Layout/AppLayout';
import Button from '../components/ui/Button';
import { ArrowRight, CheckCircle, Clock, Shield, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      title: 'Effortless Task Management',
      description: 'Create, organize, and prioritize your tasks with an intuitive interface designed for efficiency.',
      icon: <CheckCircle className="h-6 w-6 text-primary-600" />,
    },
    {
      title: 'Priority Tracking',
      description: 'Set task priorities to ensure you focus on what matters most and never miss important deadlines.',
      icon: <Zap className="h-6 w-6 text-primary-600" />,
    },
    {
      title: 'Your Data, Secured',
      description: 'We prioritize the security of your data with industry-standard encryption and protection.',
      icon: <Shield className="h-6 w-6 text-primary-600" />,
    },
    {
      title: 'Time Efficiency',
      description: 'Save time with a streamlined workflow designed to help you accomplish more in less time.',
      icon: <Clock className="h-6 w-6 text-primary-600" />,
    },
  ];

  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary-50 to-white pt-16 pb-24 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0 animate-fadeIn">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Organize Your Life</span>
                <span className="block text-primary-600">One Task at a Time</span>
              </h1>
              <p className="mt-5 max-w-xl text-xl text-gray-500">
                TaskMaster helps you manage tasks effortlessly, prioritize your work, and achieve your goals with a beautifully designed experience.
              </p>
              <div className="mt-8 sm:flex">
                <div className="rounded-md shadow">
                  <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                    <Button
                      size="lg"
                      rightIcon={<ArrowRight className="ml-2 h-5 w-5" />}
                    >
                      {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
                    </Button>
                  </Link>
                </div>
                {!isAuthenticated && (
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/login">
                      <Button variant="outline" size="lg">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:block animate-slideUp">
              <img
                className="h-auto w-full max-w-lg rounded-lg shadow-xl"
                src="https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Task management illustration"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to stay organized
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              TaskMaster provides all the tools you need to manage your tasks effectively.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 animate-slideIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Sign up for free today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Join thousands of users who organize their work and life with TaskMaster.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/register"} className="mt-8 inline-block">
            <Button 
              size="lg"
              className="w-full sm:w-auto"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;