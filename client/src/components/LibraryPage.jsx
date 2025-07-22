import React, { useState, useEffect } from 'react';
import { Play, Trash2 } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { supabase } from '../lib/supabase';

const LibraryPage = ({ user }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    if (user) {
      fetchLibrarySongs();
    }
  }, [user]);

  const fetchLibrarySongs = async () => {
    try {
      const { data, error } = await supabase
        .from('library_songs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error('Error fetching library songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeSong = async (songId) => {
    try {
      await supabase
        .from('library_songs')
        .delete()
        .eq('id', songId);
      
      setSongs(songs.filter(song => song.id !== songId));
    } catch (error) {
      console.error('Error removing song:', error);
    }
  };

  const playAllSongs = () => {
    if (songs.length > 0) {
      const tracks = songs.map(song => ({
        id: song.video_id,
        title: song.title,
        thumbnail: song.thumbnail,
        channel: song.channel
      }));
      playTrack(tracks[0], tracks);
    }
  };

  const playSong = (song) => {
    const track = {
      id: song.video_id,
      title: song.title,
      thumbnail: song.thumbnail,
      channel: song.channel
    };
    const tracks = songs.map(s => ({
      id: s.video_id,
      title: s.title,
      thumbnail: s.thumbnail,
      channel: s.channel
    }));
    playTrack(track, tracks);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Library</h1>
          {songs.length > 0 && (
            <button
              onClick={playAllSongs}
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-400 transition-colors flex items-center gap-2"
            >
              <Play size={16} />
              Play All
            </button>
          )}
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">Your library is empty</p>
            <p>Start adding songs by searching and clicking the heart icon!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {songs.map((song) => (
              <div
                key={song.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors group flex items-center gap-4"
              >
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {song.title}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">
                    {song.channel}
                  </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => playSong(song)}
                    className="bg-green-500 text-white rounded-full p-2 hover:bg-green-400 transition-colors"
                  >
                    <Play size={16} />
                  </button>
                  <button
                    onClick={() => removeSong(song.id)}
                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;