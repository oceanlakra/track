import React, { useState, useEffect } from 'react';
import { Search, Play, Heart } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { supabase } from '../lib/supabase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const SearchPage = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { playTrack } = usePlayer();

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const performSearch = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/search`, {
        params: { query }
      });
      setResults(response.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const addToLibrary = async (track) => {
    if (!user) return;
    try {
      await supabase
        .from('library_songs')
        .insert({
          user_id: user.id,
          video_id: track.id,
          title: track.title,
          thumbnail: track.thumbnail,
          channel: track.channel
        });
    } catch (error) {
      console.error('Error adding to library:', error);
    }
  };

  const handlePlayTrack = (track) => {
    playTrack(track, results);
  };

  return (
    <div className="flex-1 bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search Music</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for songs, artists, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {Array.isArray(results) && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((track) => (
              <div
                key={track.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors group cursor-pointer"
              >
                <div className="relative mb-4">
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="bg-green-500 text-white rounded-full p-3 hover:bg-green-400 transition-colors"
                    >
                      <Play size={20} />
                    </button>
                    {user && (
                      <button
                        onClick={() => addToLibrary(track)}
                        className="bg-gray-700 text-white rounded-full p-3 hover:bg-gray-600 transition-colors"
                      >
                        <Heart size={20} />
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-1 truncate">{track.title}</h3>
                <p className="text-gray-400 text-sm truncate">{track.channel}</p>
              </div>
            ))}
          </div>
        )}

        {searchQuery && !loading && Array.isArray(results) && results.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
