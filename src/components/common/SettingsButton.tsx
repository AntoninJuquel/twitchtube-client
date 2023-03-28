import { useToggle } from 'usehooks-ts';
import CustomFab from './CustomFab';

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
      <CustomFab
        position="top-right"
        onClick={toggle}
        icon="settings"
        size="small"
      />
      <SettingsComponent open={open} onClose={toggle} />
    </>
  );
}
