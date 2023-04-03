import { useToggle } from 'usehooks-ts';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Icon,
} from '@mui/material';
import { Node, Panel } from 'reactflow';
import { TwitchClip } from 'twitch-api-helix';
import { durationString } from '@/utils/duration';
import VideoPlayer from './VideoPlayer';

type VideoInfoPanelProps = {
  selectedClips: Omit<Map<string, TwitchClip>, 'clear' | 'set' | 'delete'>;
  upload: () => void;
  linearGraph: Node<TwitchClip>[] | null | undefined;
};

export default function VideoInfoPanel({
  selectedClips,
  upload,
  linearGraph,
}: VideoInfoPanelProps) {
  const duration = Array.from(selectedClips.values()).reduce((acc, clip) => {
    return acc + clip.duration;
  }, 0);

  const [showPreview, togglePreview] = useToggle(false);

  return (
    <>
      <Panel position="bottom-center">
        <Card variant="outlined">
          <CardContent>
            <Typography>Clips - {selectedClips.size}</Typography>
            <Typography>{durationString(duration)}</Typography>
          </CardContent>
          <CardActions>
            <Button
              onClick={togglePreview}
              fullWidth
              variant="contained"
              disabled={!linearGraph}
            >
              <Icon>movie</Icon>
            </Button>
            <Button
              onClick={upload}
              fullWidth
              variant="contained"
              disabled={!linearGraph}
            >
              <Icon>send</Icon>
            </Button>
          </CardActions>
        </Card>
      </Panel>
      <VideoPlayer
        clips={linearGraph?.map((node) => node.data) || []}
        open={showPreview}
        toggle={togglePreview}
      />
    </>
  );
}
