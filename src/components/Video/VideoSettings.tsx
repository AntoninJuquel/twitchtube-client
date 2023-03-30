import { useEffect, useState } from 'react';
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
  Checkbox,
  Box,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as api from '@/api';
import { useTabs } from '@/hooks';
import VideoFolderSelector from './VideoFolderSelector';

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
  const [openFolderSelector, setOpenFolderSelector] = useState(false);
  const [initialValues, setInitialValues] = useState<object | null>();

  useEffect(() => {
    if (!open) return;
    (async () => {
      const data = await api.getVideoConfig();
      setInitialValues({
        width: data.width,
        height: data.height,
        fps: data.fps,
        transitionName: data.transition.name,
        transitionDuration: data.transition.duration,
        keepSourceAudio: data.keepSourceAudio,
        outPath: data.outPath,
      });
    })();
  }, [open]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      width: 1920,
      height: 1080,
      fps: 30,
      transitionName: 'fade',
      transitionDuration: 0.5,
      keepSourceAudio: true,
      outPath: '',
      ...initialValues,
    },
    validationSchema,
    onSubmit: async (values) => {
      const {
        width,
        height,
        fps,
        transitionName,
        transitionDuration,
        keepSourceAudio,
        outPath,
      } = values;
      await api.postVideoConfig({
        width,
        height,
        fps,
        transition: {
          name: transitionName,
          duration: transitionDuration,
        },
        keepSourceAudio,
        outPath,
      });
      onClose();
    },
  });

  const { Tabs, activeTab } = useTabs('resolution', [
    {
      label: 'Resolution',
      value: 'resolution',
    },
    {
      label: 'Transition',
      value: 'transition',
    },
  ]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form method="dialog" onSubmit={formik.handleSubmit}>
        <DialogTitle>{Tabs}</DialogTitle>

        <DialogContent>
          <Stack gap={2}>
            {activeTab === 'resolution' && (
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
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="keepSourceAudio"
                        name="keepSourceAudio"
                        value={formik.values.keepSourceAudio}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.keepSourceAudio}
                      />
                    }
                    label="Keep source audio"
                  />
                </Box>
                <Button onClick={() => setOpenFolderSelector(true)}>
                  {formik.values.outPath}
                </Button>
                <VideoFolderSelector
                  open={openFolderSelector}
                  value={formik.values.outPath}
                  onChange={(value) => formik.handleChange('outPath')(value)}
                  onClose={() => setOpenFolderSelector(false)}
                />
              </>
            )}

            {activeTab === 'transition' && (
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
                  defaultValue={formik.values.transitionName}
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
          <Button
            type="reset"
            onClick={(e) => {
              formik.handleReset(e);
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
