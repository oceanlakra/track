import { useState } from 'react';
import axios from 'axios';

const usePrefetchCache = () => {
  const [trackCache, setTrackCache] = useState(new Map());

  const getTrackUrl = async (trackId) => {
    if (trackCache.has(trackId)) {
      return trackCache.get(trackId);
    }

    try {
      const response = await axios.get(`/api/stream/${trackId}`);
      const url = response.data.url;

      setTrackCache(prev => {
        const updated = new Map(prev);
        updated.set(trackId, url);
        return updated;
      });

      return url;
    } catch (error) {
      console.error(`Error fetching track ${trackId}:`, error);
      throw error;
    }
  };

  const prefetchTracks = (tracks) => {
    tracks.forEach(async (track) => {
      if (!trackCache.has(track.id)) {
        try {
          const response = await axios.get(`/api/stream/${track.id}`);
          const url = response.data.url;
          setTrackCache(prev => {
            const updated = new Map(prev);
            updated.set(track.id, url);
            return updated;
          });
        } catch (error) {
          console.warn(`Failed to prefetch track ${track.id}`, error);
        }
      }
    });
  };

  const clearCache = () => setTrackCache(new Map());

  return { getTrackUrl, prefetchTracks, clearCache, trackCache };
};

export default usePrefetchCache;
