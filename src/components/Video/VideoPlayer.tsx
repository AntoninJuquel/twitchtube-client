import { Player } from '@remotion/player';
import { TwitchClip } from 'twitch-api-helix';
import { Dialog } from '@mui/material';
import MyComp from '../../video/Composition';

type VideoPlayerProps = {
  clips: TwitchClip[];
  open: boolean;
  toggle: () => void;
};

export default function VideoPlayer({ clips, open, toggle }: VideoPlayerProps) {
  const duration = clips.reduce((acc, clip) => acc + clip.duration, 0);

  return (
    <Dialog open={open} maxWidth="xl" onClose={toggle}>
      <Player
        component={MyComp}
        inputProps={{ clips }}
        durationInFrames={Math.max(Math.round(duration), 1) * 30}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        style={{
          width: 1280,
          height: 720,
        }}
        controls
      />
    </Dialog>
  );
}
