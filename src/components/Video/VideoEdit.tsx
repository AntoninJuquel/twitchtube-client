import { cloneElement, forwardRef } from 'react';
import { Button, Dialog, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { ReactFlowProvider } from 'reactflow';

import { useToggle } from 'usehooks-ts';
import { TwitchClip } from '@/api';

import VideoFlow from './VideoFlow';
import VideoSettings from './VideoSettings';
import { SettingsButton } from '../common';

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
          <KeyboardArrowDownIcon />
        </Button>
        <ReactFlowProvider>
          <VideoFlow selectedClips={selectedClips} />
        </ReactFlowProvider>

        <SettingsButton SettingsComponent={VideoSettings} />
      </Dialog>
    </>
  );
}
