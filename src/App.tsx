import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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

      <Footer />
    </div>
  );
}

export default App;
