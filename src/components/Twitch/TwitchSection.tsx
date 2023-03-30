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
  Icon,
  Slide,
} from '@mui/material';

import { Actions } from 'usehooks-ts';
import { TwitchClip } from 'twitch-api-helix';

import { durationString } from '@/utils/duration';

import TwitchClipCard from './TwitchClipCard';
import TwitchForm from './TwitchForm';

type TwitchNodeProps = {
  id: string;
  removeSection: (id: string) => void;
  selectedClips: Omit<Map<string, TwitchClip>, 'set' | 'clear' | 'delete'>;
  actions: Actions<string, TwitchClip>;
};

export default function TwitchSection({
  id,
  removeSection,
  selectedClips,
  actions,
}: TwitchNodeProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [clips, setClips] = useState<TwitchClip[]>([]);

  const allClipDefined = clips.every((clip) => Boolean(clip));
  const allSelected = clips.every((clip) =>
    Boolean(selectedClips.get(clip?.id))
  );
  const someSelected = clips.some((clip) =>
    Boolean(selectedClips.get(clip?.id))
  );
  const duration = clips.reduce((acc, clip) => acc + (clip?.duration || 0), 0);
  const selectedClipsInSection = clips.filter((clip) =>
    selectedClips.get(clip?.id)
  );
  const selectedDuration = selectedClipsInSection.reduce(
    (acc, clip) => acc + (clip?.duration || 0),
    0
  );

  return (
    <Stack spacing={1} margin={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={() => removeSection(id)} color="primary">
          <Icon>delete</Icon>
        </IconButton>
        <TwitchForm
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
          expandIcon={<Icon>expand_more</Icon>}
          style={{ backgroundColor: '#f5f5f5' }}
        >
          <Slide
            in={allClipDefined && clips.length > 0}
            direction="left"
            unmountOnExit
          >
            <Stack spacing={5} direction="row" alignItems="center">
              <Checkbox
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  if (e.target.checked) {
                    clips.forEach((clip) => actions.set(clip.id, clip));
                  } else {
                    clips.forEach((clip) => actions.remove(clip.id));
                  }
                }}
                checked={allSelected && clips.length > 0}
                indeterminate={someSelected && !allSelected && clips.length > 0}
                size="small"
              />
              <Typography>
                Clips {clips.length} - {durationString(duration)}
              </Typography>
              <Typography>
                Selected {selectedClipsInSection.length} -{' '}
                {durationString(selectedDuration)}
              </Typography>
            </Stack>
          </Slide>
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
