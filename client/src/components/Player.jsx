import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';

const Player = () => {
  const { 
    currentTrack, 
    isPlaying, 
    loading,
    currentTime,
    duration,
    volume,
    togglePlayPause, 
    playNext, 
    playPrev,
    setVolume,
    seekTo
  } = usePlayer();

  if (!currentTrack) return null;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (x / width) * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img 
            src={currentTrack.thumbnail} 
            alt={currentTrack.title}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">
              {currentTrack.title}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {currentTrack.channel}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
          <div className="flex items-center gap-4">
            <button
              onClick={playPrev}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack size={20} />
            </button>
            
            <button
              onClick={togglePlayPause}
              disabled={loading}
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} />
              )}
            </button>
            
            <button
              onClick={playNext}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400 min-w-[35px]">
              {formatTime(currentTime)}
            </span>
            <div 
              className="flex-1 bg-gray-700 rounded-full h-1 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="bg-green-500 h-1 rounded-full transition-all"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 min-w-[35px]">
              {formatTime(duration || 0)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Volume2 size={16} className="text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;