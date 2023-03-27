import GLTransitions from 'gl-transitions';
import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Stack,
  TextField,
  Autocomplete,
  Tab,
  Tabs,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import useTabs from '@/hooks/useTabs';

type VideoSettingsProps = {
  open: boolean;
  onClose: () => void;
};

const validationSchema = yup.object({
  width: yup.number().required('Width is required'),
  height: yup.number().required('Height is required'),
  fps: yup.number().required('FPS is required'),
  transitionName: yup.string().required('Transition is required'),
  transitionDuration: yup.number().required('Transition duration is required'),
});

const EXTRA_TRANSITIONS = [
  'directional-left',
  'directional-right',
  'directional-up',
  'directional-down',
  'random',
  'dummy',
];

const TRANSITIONS = GLTransitions.map((transition) => transition.name).concat(
  EXTRA_TRANSITIONS
);

export default function VideoSettings({ open, onClose }: VideoSettingsProps) {
  const formik = useFormik({
    initialValues: {
      width: 1920,
      height: 1080,
      fps: 30,
      transitionName: 'fade',
      transitionDuration: 0.5,
    },
    validationSchema,
    onReset: onClose,
    onSubmit: async (values) => {
      const { width, height, fps, transitionName, transitionDuration } = values;
      localStorage.setItem('width', width.toString());
      localStorage.setItem('height', height.toString());
      localStorage.setItem('fps', fps.toString());
      localStorage.setItem('transitionName', transitionName);
      localStorage.setItem('transitionDuration', transitionDuration.toString());
      onClose();
    },
  });

  const [settings, setSettings] = useTabs('resolution');

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form method="dialog" onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Tabs value={settings} onChange={setSettings}>
            <Tab label="Resolution" value="resolution" />
            <Tab label="Transition" value="transition" />
          </Tabs>
        </DialogTitle>

        <DialogContent>
          <Stack gap={2}>
            {settings === 'resolution' && (
              <>
                <InputLabel>Please select video resolution</InputLabel>
                <Breadcrumbs separator="x">
                  <TextField
                    id="width"
                    name="width"
                    label="Width"
                    value={formik.values.width}
                    onChange={formik.handleChange}
                    error={formik.touched.width && Boolean(formik.errors.width)}
                    type="number"
                    helperText={formik.errors.width}
                    onBlur={formik.handleBlur}
                    size="small"
                  />
                  <TextField
                    id="height"
                    name="height"
                    label="Height"
                    value={formik.values.height}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.height && Boolean(formik.errors.height)
                    }
                    type="number"
                    helperText={formik.errors.height}
                    onBlur={formik.handleBlur}
                    size="small"
                  />
                </Breadcrumbs>
                <TextField
                  id="fps"
                  name="fps"
                  label="Frames per second"
                  value={formik.values.fps}
                  onChange={formik.handleChange}
                  error={formik.touched.fps && Boolean(formik.errors.fps)}
                  type="number"
                  helperText={formik.errors.fps}
                  onBlur={formik.handleBlur}
                  size="small"
                />
              </>
            )}

            {settings === 'transition' && (
              <>
                <InputLabel>Default Transition</InputLabel>
                <Autocomplete
                  id="transitionName"
                  options={TRANSITIONS}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    <TextField {...params} label="Name" />
                  )}
                  value={formik.values.transitionName}
                  onChange={(event, newValue) => {
                    formik.handleChange('transitionName')(newValue as string);
                  }}
                  onBlur={formik.handleBlur}
                  size="small"
                />
                <TextField
                  id="transitionDuration"
                  name="transitionDuration"
                  label="Duration (seconds)"
                  value={formik.values.transitionDuration}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.transitionDuration &&
                    Boolean(formik.errors.transitionDuration)
                  }
                  type="number"
                  helperText={formik.errors.transitionDuration}
                  inputProps={{
                    step: 0.1,
                  }}
                  size="small"
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="reset" onClick={formik.handleReset}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
