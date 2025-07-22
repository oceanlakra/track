import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';


const PlayerContext = createContext(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const playTrack = async (track, newQueue) => {
    setLoading(true);
    setCurrentTrack(track);
    
    if (newQueue) {
      setQueue(newQueue);
      setCurrentIndex(newQueue.findIndex(t => t.id === track.id));
    } else if (queue.length === 0) {
      setQueue([track]);
      setCurrentIndex(0);
    }

    try {
      const response = await axios.get(`/api/stream/${track.id}`);
      if (audioRef.current) {
        audioRef.current.src = response.data.url;
        audioRef.current.load();
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing track:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextTrack = queue[currentIndex + 1];
      playTrack(nextTrack);
    }
  };

  const playPrev = () => {
    if (queue.length > 0 && currentIndex > 0) {
      const prevTrack = queue[currentIndex - 1];
      playTrack(prevTrack);
    }
  };

  const setVolume = (newVolume) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      playNext();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const value = {
    currentTrack,
    isPlaying,
    queue,
    currentIndex,
    volume,
    currentTime,
    duration,
    loading,
    playTrack,
    togglePlayPause,
    playNext,
    playPrev,
    setVolume,
    seekTo,
    audioRef
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} />
    </PlayerContext.Provider>
  );
};