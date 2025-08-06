import React, { useState } from 'react';
import Button from '../ui/Button';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'events', label: 'Events', icon: 'bi-calendar-event' },
    { id: 'calendar', label: 'Calendar', icon: 'bi-calendar3' },
    { id: 'analytics', label: 'Analytics', icon: 'bi-graph-up' },
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-800 to-emerald-600 rounded-xl flex items-center justify-center">
                <i className="bi bi-calendar-check text-white text-lg"></i>
              </div>
              <h1 className="text-xl font-bold text-primary-800">EventPro</h1>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    currentView === item.id
                      ? 'bg-primary-800 text-white shadow-lg'
                      : 'text-gray-600 hover:text-primary-800 hover:bg-primary-50'
                  }`}
                >
                  <i className={`${item.icon} text-sm`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewChange('create-event')}
              className="hidden sm:flex"
            >
              <i className="bi bi-plus-lg mr-2"></i>
              New Event
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <i className="bi bi-person text-white text-sm"></i>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">Admin User</span>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-800 hover:bg-primary-50"
            >
              <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-lg`}></i>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-up">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                    currentView === item.id
                      ? 'bg-primary-800 text-white'
                      : 'text-gray-600 hover:text-primary-800 hover:bg-primary-50'
                  }`}
                >
                  <i className={`${item.icon} text-sm`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onViewChange('create-event');
                  setIsMobileMenuOpen(false);
                }}
                className="mt-4"
              >
                <i className="bi bi-plus-lg mr-2"></i>
                New Event
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
