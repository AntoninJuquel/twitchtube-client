import { createContext, useCallback, useMemo, useContext } from 'react';

import { useMap } from 'usehooks-ts';
import { Clip } from '@/remotion/Clip';

interface VideoContextState {
  clips: Omit<Map<string, Clip>, 'set' | 'clear' | 'delete'>;
}

interface VideoContextActions {
  addClip: (clip: Clip) => void;
  removeClip: (clipId: string) => void;
  setClipSelect: (clipId: string, selected: boolean) => void;
  reorderClips: (newOrder: string[]) => void;
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
  setClipSelect: () => {
    throw new Error('setClipSelect not implemented');
  },
  reorderClips: () => {
    throw new Error('reorderClips not implemented');
  },
});

function VideoContextProvider({ children }: { children: React.ReactNode }) {
  const [clips, actions] = useMap<string, Clip>(new Map());

  const addClip = useCallback(
    (clip: Clip) => {
      actions.set(clip.id, clip);
    },
    [actions]
  );

  const removeClip = useCallback(
    (clipId: string) => {
      actions.remove(clipId);
    },
    [actions]
  );

  const setClipSelect = useCallback(
    (clipId: string, selected: boolean) => {
      const clip = clips.get(clipId);
      if (clip) {
        clip.selected = selected;
        actions.set(clipId, clip);
      }
    },
    [clips, actions]
  );

  const reorderClips = useCallback(
    (newOrder: string[]) => {
      const newClips = new Map<string, Clip>();
      newOrder.forEach((id) => {
        const clip = clips.get(id);
        if (clip) {
          newClips.set(id, clip);
        }
      });
      actions.setAll(newClips);
    },
    [clips, actions]
  );

  const value = useMemo(
    () => ({ clips, addClip, removeClip, setClipSelect, reorderClips }),
    [clips, addClip, removeClip, setClipSelect, reorderClips]
  );

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
