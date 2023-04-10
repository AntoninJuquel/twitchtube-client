import { v4 as uuid } from 'uuid';
import { useCallback } from 'react';
import { useMap } from 'usehooks-ts';
import { TransitionGroup } from 'react-transition-group';
import { Fab, Icon, Collapse } from '@mui/material';

import { TwitchClipRequestParams } from 'twitch-api-helix';

import TwitchSection from '@/components/twitch/TwitchSection';

export default function TwitchSections() {
  const [sections, actions] = useMap<string, TwitchClipRequestParams | null>(
    new Map([[uuid(), null]])
  );

  const addSection = useCallback(() => {
    actions.set(uuid(), null);
  }, [actions]);

  return (
    <>
      <TransitionGroup>
        {Array.from(sections.entries()).map(([id]) => (
          <Collapse key={id} timeout={100}>
            <TwitchSection removeSection={() => actions.remove(id)} />
          </Collapse>
        ))}
      </TransitionGroup>
      <Fab
        color="primary"
        onClick={addSection}
        size="large"
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Icon>add</Icon>
      </Fab>
    </>
  );
}
