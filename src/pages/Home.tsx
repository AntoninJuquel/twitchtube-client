import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import { Button, Fab, Zoom, Collapse, Box } from '@mui/material';
import Add from '@mui/icons-material/Add';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { TransitionGroup } from 'react-transition-group';

import { useMap } from 'usehooks-ts';

import {
  SettingsButton,
  TwitchSection,
  TwitchSettings,
  VideoEdit,
} from '@/components';
import { Twitch, TwitchClip } from '@/api';

const twitch = new Twitch(
  localStorage.getItem('clientId') || '',
  localStorage.getItem('clientSecret') || ''
);

function Home() {
  const [sections, sectionsActions] = useMap<string, string>(
    new Map([[uuid(), '']])
  );
  const [selectedClips, actions] = useMap<string, TwitchClip>(new Map());

  const trigger = useScrollTrigger({
    target: window,
    disableHysteresis: true,
    threshold: 100,
  });
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addSection = () => {
    sectionsActions.set(uuid(), '');
  };

  const removeSection = (id: string) => {
    sectionsActions.remove(id);
  };

  return (
    <Box>
      <TransitionGroup>
        {Array.from(sections.entries()).map(([key]) => (
          <Collapse key={key} timeout={100}>
            <TwitchSection
              twitch={twitch}
              id={key}
              removeSection={removeSection}
              selectedClips={selectedClips}
              actions={actions}
            />
          </Collapse>
        ))}
      </TransitionGroup>

      <Fab
        onClick={addSection}
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          left: 32,
          zIndex: 1,
        }}
      >
        <Add />
      </Fab>

      <Zoom in={trigger}>
        <Fab
          onClick={scrollToTop}
          color="primary"
          size="small"
          aria-label="scroll back to top"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>

      <SettingsButton
        SettingsComponent={({ open, onClose }) =>
          TwitchSettings({ twitch, open, onClose })
        }
      />

      <VideoEdit
        trigger={
          <Button
            variant="contained"
            color="primary"
            size="small"
            aria-label="scroll back to top"
            sx={{
              position: 'fixed',
              bottom: 32,
              right: '50%',
              zIndex: 1,
            }}
          >
            <KeyboardArrowUpIcon />
          </Button>
        }
        selectedClips={selectedClips}
      />
    </Box>
  );
}

export default Home;
