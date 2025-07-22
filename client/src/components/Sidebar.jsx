import React from 'react';
import { Search, Library, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Sidebar = ({ currentPage, setCurrentPage, user }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Library', icon: Library }
  ];

  return (
    <div className="w-64 bg-black text-white h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-green-400">Track</h1>
      </div>
      
      <nav className="flex-1 px-3">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentPage(id)}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg mb-2 transition-colors ${
              currentPage === id 
                ? 'bg-green-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {user && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="text-white font-medium">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;