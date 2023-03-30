import { v4 as uuid } from 'uuid';
import { Button, Collapse, Box, Icon } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { useMap } from 'usehooks-ts';
import { TwitchClip } from 'twitch-api-helix';

import {
  CustomFab,
  ScrollToTop,
  SettingsButton,
  TwitchSection,
  TwitchSettings,
  VideoEdit,
} from '@/components';

function Home() {
  const [sections, sectionsActions] = useMap<string, string>(
    new Map([[uuid(), '']])
  );
  const [selectedClips, actions] = useMap<string, TwitchClip>(new Map());

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
              id={key}
              removeSection={removeSection}
              selectedClips={selectedClips}
              actions={actions}
            />
          </Collapse>
        ))}
      </TransitionGroup>

      <CustomFab position="bottom-left" onClick={addSection} />

      <ScrollToTop />

      <SettingsButton SettingsComponent={TwitchSettings} />

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
            <Icon>keyboard_arrow_up</Icon>
          </Button>
        }
        selectedClips={selectedClips}
      />
    </Box>
  );
}

export default Home;
