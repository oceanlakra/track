import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import { PlayerProvider } from './contexts/PlayerContext';
import Sidebar from './components/Sidebar';
import SearchPage from './components/SearchPage';
import LibraryPage from './components/LibraryPage';
import AuthPage from './components/AuthPage';
import Player from './components/Player';

function App() {
  const [currentPage, setCurrentPage] = useState('search');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Redirect to auth if trying to access library without being logged in
    if (currentPage === 'library' && !user) {
      setCurrentPage('auth');
    }
  }, [currentPage, user]);

  const renderPage = () => {
    switch (currentPage) {
      case 'search':
        return <SearchPage user={user} />;
      case 'library':
        return user ? <LibraryPage user={user} /> : <AuthPage />;
      case 'auth':
        return <AuthPage />;
      default:
        return <SearchPage user={user} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PlayerProvider>
      <div className="h-screen bg-gray-900 text-white flex overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar 
            currentPage={currentPage} 
            setCurrentPage={(page) => {
              setCurrentPage(page);
              setSidebarOpen(false);
            }} 
            user={user} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden bg-black border-b border-gray-800 p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-green-400">Track</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto pb-24">
            {renderPage()}
          </div>

          {/* Player */}
          <Player />
        </div>
      </div>
    </PlayerProvider>
  );
}

export default App;