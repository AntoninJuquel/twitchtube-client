import { useState } from 'react';

import {
  Button,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  CardActions,
  Checkbox,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Actions } from 'usehooks-ts';

import { Twitch, TwitchClip } from '@/api';
import TwitchClipCard from './TwitchClipCard';
import TwitchForm from './TwitchForm';

type TwitchNodeProps = {
  twitch: Twitch;
  id: string;
  removeSection: (id: string) => void;
  selectedClips: Omit<Map<string, TwitchClip>, 'set' | 'clear' | 'delete'>;
  actions: Actions<string, TwitchClip>;
};

export default function TwitchSection({
  twitch,
  id,
  removeSection,
  selectedClips,
  actions,
}: TwitchNodeProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [clips, setClips] = useState<TwitchClip[]>([]);
  return (
    <div
      style={{
        margin: '10px',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Button onClick={() => removeSection(id)}>
          <DeleteIcon />
        </Button>
        <TwitchForm
          twitch={twitch}
          onGetClips={(newClips) => {
            setClips(newClips);
            setExpanded(true);
          }}
        />
      </Stack>

      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          expandIcon={<ExpandMoreIcon />}
          style={{ backgroundColor: '#f5f5f5' }}
        >
          <Typography>Clips {clips.length}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={0.5}>
            {clips.map((clip) => (
              <Grid key={clip.id} item>
                <TwitchClipCard
                  clip={clip}
                  footer={
                    <CardActions>
                      <Checkbox
                        onChange={(e) => {
                          if (e.target.checked) {
                            actions.set(clip.id, clip);
                          } else {
                            actions.remove(clip.id);
                          }
                        }}
                        checked={Boolean(selectedClips.get(clip.id))}
                      />
                    </CardActions>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
