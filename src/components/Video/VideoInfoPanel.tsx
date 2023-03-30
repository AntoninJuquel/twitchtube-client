import { durationString } from '@/utils/duration';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Icon,
} from '@mui/material';
import { Panel } from 'reactflow';
import { TwitchClip } from 'twitch-api-helix';

type VideoInfoPanelProps = {
  selectedClips: Omit<Map<string, TwitchClip>, 'clear' | 'set' | 'delete'>;
  upload: () => void;
  linearGraph: boolean;
};

export default function VideoInfoPanel({
  selectedClips,
  upload,
  linearGraph,
}: VideoInfoPanelProps) {
  const duration = Array.from(selectedClips.values()).reduce((acc, clip) => {
    return acc + clip.duration;
  }, 0);

  return (
    <Panel position="bottom-center">
      <Card variant="outlined">
        <CardContent>
          <Typography>Clips - {selectedClips.size}</Typography>
          <Typography>{durationString(duration)}</Typography>
        </CardContent>
        <CardActions>
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
  );
}
