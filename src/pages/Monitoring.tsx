import { useEffect } from 'react';
import { useMap } from 'usehooks-ts';

import {
  Accordion,
  AccordionSummary,
  CircularProgress,
  Typography,
  Stack,
  CircularProgressProps,
  Box,
  Icon,
  IconButton,
} from '@mui/material';

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  const { value } = props;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(
          value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const response = {
  id: '5f9b2b3b-1b7a-4b0e-8b0a-5b2b3b1b7a4b',
  encodedDoneIn: null,
  encodedFrames: 928,
  renderedDoneIn: 189352,
  renderedFrames: 990,
  stitchStage: 'muxing',
  progress: 0.69,
};

export default function Monitoring() {
  const [monitorings, actions] = useMap();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
        <Stack direction="row">
          <Typography variant="h6">Title</Typography>
          <CircularProgressWithLabel variant="determinate" value={response.progress * 100} />
          <IconButton onClick={() => console.log('show logs')}>
            <Icon>assignment</Icon>
          </IconButton>
          <IconButton onClick={() => console.log('download')}>
            <Icon>download</Icon>
          </IconButton>
        </Stack>
      </AccordionSummary>
    </Accordion>
  );
}
