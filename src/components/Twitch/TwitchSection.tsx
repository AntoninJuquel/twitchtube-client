import { useState } from 'react';
import { useToggle } from 'usehooks-ts';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Grid,
  Icon,
  Stack,
  Typography,
  Checkbox,
  Slide,
  Fade,
} from '@mui/material';

import { useVideo } from '@/contexts/VideoContext';
import { formatTwitchClip } from '@/utils/twitch';
import { durationString, totalDuration } from '@/utils/duration';
import { Clip } from '@/remotion/Clip';

import { GenericTwitchResponse, TwitchClip } from 'twitch-api-helix';
import TwitchForm from './TwitchForm';
import TwitchClipCard from './TwitchClipCard';

type Props = {
  removeSection: () => void;
};

export default function TwitchSection({ removeSection }: Props) {
  const [expanded, toggleExpanded, setExpanded] = useToggle(false);
  const { clips, addClip, setClipSelect } = useVideo();
  const [clipIds, setClipIds] = useState<string[]>([]);
  const sectionClips = clipIds.map((id) => clips.get(id)) as Clip[];
  const sectionClipsSelected = sectionClips.filter((clip) => clip?.selected);
  const allSelected = sectionClipsSelected.length === sectionClips.length;
  const someSelected = sectionClipsSelected.length > 0 && !allSelected;

  const handleResult = (res: GenericTwitchResponse<TwitchClip>) => {
    res.data.forEach((clip) => addClip(formatTwitchClip(clip)));
    setClipIds(res.data.map((clip) => clip.id));
    setExpanded(true);
  };

  const toggleAllSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    sectionClips.forEach((clip) => {
      setClipSelect(clip.id, event.target.checked);
    });
  };

  return (
    <Accordion expanded={expanded} onChange={toggleExpanded}>
      <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
        <Stack>
          <Stack direction="row" spacing={2} alignItems="center" width="100%">
            <IconButton onClick={removeSection}>
              <Icon>delete</Icon>
            </IconButton>
            <TwitchForm handleResult={handleResult} />
          </Stack>
          <Slide in={sectionClips.length > 0} direction="right" unmountOnExit>
            <Stack direction="row" spacing={2} alignItems="center" width="100%">
              <Checkbox
                onChange={toggleAllSelected}
                onClick={(e) => e.stopPropagation()}
                checked={allSelected && sectionClips.length > 0}
                indeterminate={someSelected && sectionClips.length > 0}
              />
              <Typography>
                Clips {sectionClips.length} - {durationString(totalDuration(sectionClips))}
              </Typography>
              <Fade in={sectionClipsSelected.length > 0} unmountOnExit>
                <Typography>
                  Selected {sectionClipsSelected.length} -{' '}
                  {durationString(totalDuration(sectionClipsSelected))}
                </Typography>
              </Fade>
            </Stack>
          </Slide>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={0.5} justifyContent="center">
          {sectionClips.map((clip) => (
            <Grid key={clip.id} item>
              <TwitchClipCard clip={clip} checkbox />
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
