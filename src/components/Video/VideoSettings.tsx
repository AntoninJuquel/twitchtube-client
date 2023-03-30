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
  FormControlLabel,
  Box,
  InputAdornment,
  Icon,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as api from '@/api';
import { useAlert, useTabs } from '@/hooks';
import VideoFolderSelector from './VideoFolderSelector';

type VideoSettingsProps = {
  open: boolean;
  onClose: () => void;
};

const resolutionSchema = yup.object({
  width: yup.number().required('Width is required'),
  height: yup.number().required('Height is required'),
  fps: yup.number().required('FPS is required'),
});

const transitionSchema = yup.object({
  name: yup.string().required('Transition is required'),
  duration: yup.number().required('Transition duration is required'),
});

const foldersSchema = yup.object({
  outPath: yup.string().required('Output path is required'),
  tempPath: yup.string().required('Temporary path is required'),
});

const extraSchema = yup.object({
  keepSourceAudio: yup.boolean(),
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

type VideoConfig = {
  width: number;
  height: number;
  fps: number;
  outPath: string;
  tempPath: string;
  transition: {
    name: string;
    duration: number;
  };
  keepSourceAudio: boolean;
};

type SettingsProps = {
  initialValues: VideoConfig;
  onSubmit: (values: Partial<VideoConfig>) => void;
};

function TransitionSettings({ initialValues, onSubmit }: SettingsProps) {
  const formik = useFormik({
    initialValues: {
      name: initialValues.transition.name,
      duration: initialValues.transition.duration,
    },
    onSubmit: async (values) => {
      onSubmit({
        transition: {
          name: values.name,
          duration: values.duration,
        },
      });
    },
    validationSchema: transitionSchema,
  });
  return (
    <form method="dialog" onSubmit={formik.handleSubmit}>
      <DialogContent>
        <Stack gap={2}>
          <InputLabel>Please select the default transition</InputLabel>
          <Autocomplete
            id="name"
            options={TRANSITIONS}
            sx={{ width: 300 }}
            renderInput={(params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <TextField {...params} label="Name" />
            )}
            defaultValue={formik.values.name}
            value={formik.values.name}
            onChange={(event, newValue) => {
              formik.handleChange('name')(newValue as string);
            }}
            onBlur={formik.handleBlur}
            size="small"
          />
          <TextField
            id="duration"
            name="duration"
            label="Duration (seconds)"
            value={formik.values.duration}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.duration && Boolean(formik.errors.duration)}
            type="number"
            helperText={formik.errors.duration}
            inputProps={{
              step: 0.1,
            }}
            size="small"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="submit">Save</Button>
      </DialogActions>
    </form>
  );
}

function ResolutionSettings({ initialValues, onSubmit }: SettingsProps) {
  const formik = useFormik({
    initialValues: {
      width: initialValues.width,
      height: initialValues.height,
      fps: initialValues.fps,
    },
    onSubmit,
    validationSchema: resolutionSchema,
  });

  return (
    <form method="dialog" onSubmit={formik.handleSubmit}>
      <DialogContent>
        <Stack gap={2}>
          <InputLabel>Please select video resolution and framerate</InputLabel>
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
              error={formik.touched.height && Boolean(formik.errors.height)}
              type="number"
              helperText={formik.errors.height}
              onBlur={formik.handleBlur}
              size="small"
            />
          </Breadcrumbs>
          <TextField
            id="fps"
            name="fps"
            label="FPS"
            value={formik.values.fps}
            onChange={formik.handleChange}
            error={formik.touched.fps && Boolean(formik.errors.fps)}
            type="number"
            helperText={formik.errors.fps}
            onBlur={formik.handleBlur}
            size="small"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="submit">Save</Button>
      </DialogActions>
    </form>
  );
}

function FoldersSettings({ initialValues, onSubmit }: SettingsProps) {
  const [selectedValue, setSelectedValue] = useState<'outPath' | 'tempPath'>();
  const formik = useFormik({
    initialValues: {
      outPath: initialValues.outPath,
      tempPath: initialValues.tempPath,
    },
    onSubmit,
    validationSchema: foldersSchema,
  });

  return (
    <form method="dialog" onSubmit={formik.handleSubmit}>
      <DialogContent>
        <Stack gap={2}>
          <InputLabel>Please select output and temporary folders</InputLabel>
          <TextField
            label="Output folder"
            value={formik.values.outPath}
            size="small"
            onClick={() => setSelectedValue('outPath')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>folder</Icon>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Temp folder"
            value={formik.values.tempPath}
            size="small"
            onClick={() => setSelectedValue('tempPath')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>folder</Icon>
                </InputAdornment>
              ),
            }}
          />
          <VideoFolderSelector
            value={selectedValue ? formik.values[selectedValue] ?? '' : ''}
            open={selectedValue !== undefined}
            onClose={() => setSelectedValue(undefined)}
            onChange={(value) => {
              if (selectedValue) {
                formik.handleChange(selectedValue)(value);
              }
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="submit">Save</Button>
      </DialogActions>
    </form>
  );
}

function ExtraSettings({ initialValues, onSubmit }: SettingsProps) {
  const formik = useFormik({
    initialValues: {
      keepSourceAudio: initialValues.keepSourceAudio,
    },
    onSubmit,
    validationSchema: extraSchema,
  });

  return (
    <form method="dialog" onSubmit={formik.handleSubmit}>
      <DialogContent>
        <Stack gap={2}>
          <InputLabel>Extra settings</InputLabel>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  id="keepSourceAudio"
                  name="keepSourceAudio"
                  checked={formik.values.keepSourceAudio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              }
              label="Keep Source Audio"
              onClick={(e) => e.preventDefault()}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="submit">Save</Button>
      </DialogActions>
    </form>
  );
}

export default function VideoSettings({ open, onClose }: VideoSettingsProps) {
  const [initialValues, setInitialValues] = useState<VideoConfig>();

  useEffect(() => {
    if (!open) {
      setInitialValues(undefined);
      return;
    }
    (async () => {
      const data = await api.getVideoConfig();
      setInitialValues(data);
    })();
  }, [open]);

  const { Tabs, activeTab } = useTabs('resolution', [
    {
      label: 'Resolution',
      value: 'resolution',
    },
    {
      label: 'Transition',
      value: 'transition',
    },
    {
      label: 'Folders',
      value: 'folders',
    },
    {
      label: 'Extra',
      value: 'extra',
    },
  ]);

  const { showAlert, SnackbarAlert } = useAlert();

  if (!initialValues) return null;

  const onSubmit = async (values: Partial<VideoConfig>) => {
    await api.postVideoConfig(values);
    showAlert({
      message: 'Settings saved',
      severity: 'success',
      snackbar: { anchorOrigin: { vertical: 'bottom', horizontal: 'center' } },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{Tabs}</DialogTitle>
      {activeTab === 'resolution' && (
        <ResolutionSettings initialValues={initialValues} onSubmit={onSubmit} />
      )}
      {activeTab === 'transition' && (
        <TransitionSettings initialValues={initialValues} onSubmit={onSubmit} />
      )}
      {activeTab === 'folders' && (
        <FoldersSettings initialValues={initialValues} onSubmit={onSubmit} />
      )}
      {activeTab === 'extra' && (
        <ExtraSettings initialValues={initialValues} onSubmit={onSubmit} />
      )}

      {SnackbarAlert}
    </Dialog>
  );
}
