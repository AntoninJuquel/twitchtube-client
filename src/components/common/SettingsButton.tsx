import { Fab } from '@mui/material';
import { useToggle } from 'usehooks-ts';
import SettingsIcon from '@mui/icons-material/Settings';

type SettingsProps = {
  SettingsComponent: React.JSXElementConstructor<{
    open: boolean;
    onClose: () => void;
  }>;
};

export default function SettingsButton({ SettingsComponent }: SettingsProps) {
  const [open, toggle] = useToggle(false);
  return (
    <>
      <Fab
        color="primary"
        size="small"
        aria-label="scroll back to top"
        sx={{
          position: 'fixed',
          top: 32,
          right: 32,
          zIndex: 1,
        }}
        onClick={toggle}
      >
        <SettingsIcon />
      </Fab>
      <SettingsComponent open={open} onClose={toggle} />
    </>
  );
}
