import { useState } from 'react';

import {
  IconButton,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  CardActions,
  Checkbox,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
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
    <Stack spacing={1} margin={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={() => removeSection(id)} color="primary">
          <DeleteIcon />
        </IconButton>
        <TwitchForm
          twitch={twitch}
          onGetClips={(newClips) => {
            setClips(newClips);
            setExpanded(newClips.length > 0);
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
            {clips.map((clip, index) => (
              <Grid key={clip?.id ?? index} item>
                <TwitchClipCard
                  clip={clip}
                  footer={
                    clip && (
                      <CardActions
                        sx={{
                          justifyContent: 'center',
                        }}
                      >
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
                    )
                  }
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
