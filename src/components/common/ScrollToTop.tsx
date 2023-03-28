import { Fab, Icon, Zoom, useScrollTrigger } from '@mui/material';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default function ScrollToTop() {
  const trigger = useScrollTrigger({
    target: window,
    disableHysteresis: true,
    threshold: 100,
  });

  return (
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
        <Icon>keyboard_arrow_up</Icon>
      </Fab>
    </Zoom>
  );
}
