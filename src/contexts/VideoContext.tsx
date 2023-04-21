import { createContext, useCallback, useMemo, useContext } from 'react';

import { useMap } from 'usehooks-ts';
import { Clip } from '@/remotion/Clip';

interface VideoContextState {
  clips: Omit<Map<string, Clip>, 'set' | 'clear' | 'delete'>;
}

interface VideoContextActions {
  addClip: (clip: Clip) => void;
  removeClip: (clip: Clip) => void;
}

interface VideoContextType extends VideoContextState, VideoContextActions {}

const VideoContext = createContext<VideoContextType>({
  clips: new Map(),
  addClip: () => {
    throw new Error('addClip not implemented');
  },
  removeClip: () => {
    throw new Error('removeClip not implemented');
  },
});

function VideoContextProvider({ children }: { children: React.ReactNode }) {
  const [clips, actions] = useMap<string, Clip>(new Map());

  const addClip = useCallback(
    (clip: Clip) => {
      actions.set(clip.id, clip);
      document.dispatchEvent(new CustomEvent('video:clip:added', { detail: clip }));
    },
    [actions]
  );

  const removeClip = useCallback(
    (clip: Clip) => {
      actions.remove(clip.id);
      document.dispatchEvent(new CustomEvent('video:clip:removed', { detail: clip }));
    },
    [actions]
  );

  const value = useMemo(() => ({ clips, addClip, removeClip }), [clips, addClip, removeClip]);

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
}

function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoContextProvider');
  }
  return context;
}

export { VideoContextProvider, useVideo };
