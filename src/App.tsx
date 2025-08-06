import React, { useState } from 'react';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import EventList from './components/events/EventList';
import Calendar from './components/calendar/Calendar';
import Analytics from './components/analytics/Analytics';
import EventForm from './components/events/EventForm';
import Modal from './components/ui/Modal';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  const handleViewChange = (view: string) => {
    if (view === 'create-event') {
      setIsCreateEventModalOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  const handleCreateEvent = (eventData: any) => {
    console.log('Creating event:', eventData);
    setIsCreateEventModalOpen(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return <EventList />;
      case 'calendar':
        return <Calendar />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>

      <Modal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        title="Create New Event"
        size="lg"
      >
        <EventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setIsCreateEventModalOpen(false)}
        />
      </Modal>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-800 to-emerald-600 rounded-lg flex items-center justify-center">
                <i className="bi bi-lightning-charge text-white text-sm"></i>
              </div>
              <span className="text-sm text-gray-600">SparkEvents - Professional Event Management</span>
            </div>
            <div className="text-sm text-gray-500">
              Powered by <span className="font-medium text-primary-800">Websparks AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
