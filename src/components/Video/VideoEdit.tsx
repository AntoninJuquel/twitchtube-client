import { cloneElement, forwardRef } from 'react';
import { Button, Dialog, Icon, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import { useToggle } from 'usehooks-ts';
import { TwitchClip } from 'twitch-api-helix';

import { SettingsButton } from '@/components/common';

import VideoFlow from './VideoFlow';
import VideoSettings from './VideoSettings';
import VideoFolderSelector from './VideoFolderSelector';

type VideoEditProps = {
  trigger: React.ReactElement;
  selectedClips: Omit<Map<string, TwitchClip>, 'clear' | 'set' | 'delete'>;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VideoEdit({ trigger, selectedClips }: VideoEditProps) {
  const [open, toggleOpen] = useToggle(false);

  return (
    <>
      {cloneElement(trigger, { onClick: toggleOpen })}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullScreen
      >
        <Button
          variant="contained"
          color="primary"
          size="small"
          aria-label="scroll back to top"
          sx={{
            position: 'fixed',
            top: 32,
            right: '50%',
            zIndex: 1,
          }}
          onClick={toggleOpen}
        >
          <Icon>keyboard_arrow_down</Icon>
        </Button>

        <VideoFlow selectedClips={selectedClips} />

        <SettingsButton SettingsComponent={VideoSettings} />
      </Dialog>
    </>
  );
}
