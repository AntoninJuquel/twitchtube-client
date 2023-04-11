import { useToggle } from 'usehooks-ts';
import { Player } from '@remotion/player';
import { Button, Dialog } from '@mui/material';
import MyComp from '@/remotion/Composition';
import { Clip } from '@/remotion/Clip';

type VideoPlayerProps = {
  clips: Clip[];
};

export default function VideoPlayer({ clips }: VideoPlayerProps) {
  const [open, toggle] = useToggle(false);
  const duration = clips.reduce((acc, clip) => acc + clip.duration, 0);

  return (
    <>
      <Button onClick={toggle}>Preview</Button>
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
    </>
  );
}
