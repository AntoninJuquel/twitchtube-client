import {
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
  IconButton,
  Slide,
  Fade,
  Stack,
  Icon,
} from '@mui/material';

import { Panel } from 'reactflow';
import { useToggle } from 'usehooks-ts';

export default function VideoHelpPanel() {
  const [showPanel, togglePanel] = useToggle(false);

  return (
    <Panel position="top-left">
      <Fade in={!showPanel} unmountOnExit>
        <IconButton
          onClick={togglePanel}
          color="primary"
          sx={{
            position: 'absolute',
          }}
        >
          <Icon>help</Icon>
        </IconButton>
      </Fade>
      <Slide in={showPanel} unmountOnExit>
        <Card>
          <CardActions>
            <IconButton
              size="small"
              onClick={togglePanel}
              aria-expanded={showPanel}
              aria-controls="panel1a-content"
              aria-label="show more"
              color="primary"
            >
              <Icon>close</Icon>
            </IconButton>
          </CardActions>
          <CardContent>
            <Stack gap={1}>
              <Typography>
                <Chip label="alt" color="primary" size="small" /> +{' '}
                <Chip label="click" color="primary" size="small" /> to remove
                edge
              </Typography>
              <Typography>
                <Chip label="shift" color="primary" size="small" /> +{' '}
                <Chip label="drag" color="primary" size="small" /> to select
                multiple nodes
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Slide>
    </Panel>
  );
}
