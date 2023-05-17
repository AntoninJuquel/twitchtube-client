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
  Alert,
  Collapse,
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

type TwitchAlert = {
  severity: 'error' | 'success' | 'info' | 'warning';
  message: string;
  open: boolean;
};

export default function TwitchSection({ removeSection }: Props) {
  const [expanded, toggleExpanded, setExpanded] = useToggle(false);

  const { clips, addClip, removeClip } = useVideo();
  const [sectionClips, setSectionClips] = useState<Clip[]>([]);
  const [alert, setAlert] = useState<TwitchAlert>({
    severity: 'error',
    message: '',
    open: false,
  });

  const sectionClipsSelected = sectionClips.filter((clip) => clips.get(clip.id));
  const allSelected = sectionClipsSelected.length === sectionClips.length;
  const someSelected = sectionClipsSelected.length > 0 && !allSelected;

  const handlePreSubmit = () => {
    removeClip(sectionClips);
    setSectionClips([]);
    setAlert({ ...alert, open: false });
  };

  const handleResult = (res: GenericTwitchResponse<TwitchClip>) => {
    setSectionClips(res.data.map((clip) => formatTwitchClip(clip)));
    setAlert({
      open: true,
      severity: 'success',
      message: `Found ${res.data.length} clips`,
    });
    setExpanded(true);
  };

  const handleError = (newError: Error) => {
    setAlert({ open: true, severity: 'error', message: newError.message });
  };

  const handleCloseAlert = (e: React.SyntheticEvent<Element, Event>) => {
    e.stopPropagation();
    setAlert({ ...alert, open: false });
  };

  const toggleAllSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.checked;
    const action = selected ? addClip : removeClip;
    action(sectionClips);
  };

  const clipChecked = (clip: Clip) => {
    return Boolean(clips.get(clip.id));
  };

  const setClipSelect = (clip: Clip, selected: boolean) => {
    const action = selected ? addClip : removeClip;
    action([clip]);
  };

  const handleDeleteSection = () => {
    sectionClips.forEach((clip) => removeClip([clip]));
    removeSection();
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={toggleExpanded}
      elevation={3}
      sx={{
        marginBottom: 2,
      }}
    >
      <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
        <Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleDeleteSection}>
              <Icon>delete</Icon>
            </IconButton>
            <TwitchForm
              handleResult={handleResult}
              handleError={handleError}
              onSubmit={handlePreSubmit}
            />
            <Collapse in={alert.open}>
              <Alert severity={alert.severity} onClose={handleCloseAlert}>
                {alert.message}
              </Alert>
            </Collapse>
          </Stack>
          <Slide in={sectionClips.length > 0} direction="right" unmountOnExit>
            <Stack direction="row" spacing={2} alignItems="center">
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
        <Grid container spacing={0.5}>
          {sectionClips.map((clip) => (
            <Grid key={clip.id} item>
              <TwitchClipCard
                clip={clip}
                actions={['select', 'download']}
                TwitchClipCardCheckBoxProps={{
                  selected: clipChecked(clip),
                  setClipSelect,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
