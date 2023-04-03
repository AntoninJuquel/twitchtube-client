import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  TextField,
  Button,
  ButtonGroup,
  Stack,
  Breadcrumbs,
  Icon,
} from '@mui/material';

import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { TwitchClip, TwitchClipResponseBody } from 'twitch-api-helix';
import { sub } from 'date-fns';

import { useAlert } from '@/hooks';
import * as api from '@/api';

const validationSchema = yup.object({
  type: yup.string().required('Type is required'),
  name: yup.string().required('Name is required'),
  first: yup.number().min(1).max(100).required('Max is required'),
  start: yup.date().required('Start is required'),
  end: yup.date().required('End is required'),
});

type FormProps = {
  onGetClips: (clips: TwitchClip[]) => void;
};

export type TwitchFormParams = {
  type: string;
  name: string;
  first: number;
  start: string;
  end: string;
};

export default function TwitchForm({ onGetClips }: FormProps) {
  const { Alert, hideAlert, showAlert } = useAlert();
  const formik = useFormik({
    initialValues: {
      type: 'game',
      name: '',
      first: 10,
      start: sub(new Date(), { days: 1 }),
      end: new Date(),
    },
    validationSchema,
    onSubmit: async (values) => {
      hideAlert();
      onGetClips(Array(10).fill(undefined));
      await api
        .getTwitchClips(values)
        .then(({ data }: TwitchClipResponseBody) => {
          if (data.length === 0) {
            showAlert({
              message: `No clips found for ${formik.values.type} ${formik.values.name}`,
              severity: 'error',
            });
          } else {
            showAlert({
              message: `Found ${data.length} clips`,
              severity: 'success',
            });
          }
          onGetClips(data);
        })
        .catch((err) => {
          showAlert({ message: err.response.data.message, severity: 'error' });
          onGetClips([]);
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack direction="row" spacing={1} alignItems="center">
        <ButtonGroup
          sx={{
            '& .MuiButton-root': {
              borderRadius: 50,
            },
          }}
        >
          <Button
            variant={formik.values.type === 'game' ? 'contained' : 'outlined'}
            onClick={() => {
              formik.setFieldValue('type', 'game');
            }}
          >
            <Icon>sports_esports</Icon>
          </Button>
          <Button
            variant={formik.values.type === 'user' ? 'contained' : 'outlined'}
            onClick={() => {
              formik.setFieldValue('type', 'user');
            }}
          >
            <Icon>person</Icon>
          </Button>
        </ButtonGroup>
        <TextField
          id="name"
          name="name"
          label={formik.values.type === 'game' ? 'Game' : 'Broadcaster'}
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          size="small"
        />
        <TextField
          id="first"
          label="Max"
          type="number"
          InputProps={{
            inputProps: { min: 1, first: 100 },
          }}
          value={formik.values.first}
          onChange={formik.handleChange}
          error={formik.touched.first && Boolean(formik.errors.first)}
          helperText={formik.touched.first && formik.errors.first}
          size="small"
        />
        <Breadcrumbs separator="-">
          <MobileDateTimePicker
            label="Start"
            value={formik.values.start}
            onAccept={(e) => formik.setFieldValue('start', e, true)}
            slotProps={{ textField: { size: 'small' } }}
          />

          <MobileDateTimePicker
            label="End"
            value={formik.values.end}
            onAccept={(e) => formik.setFieldValue('end', e, true)}
            slotProps={{ textField: { size: 'small' } }}
          />
        </Breadcrumbs>
        <Button color="primary" variant="contained" type="submit">
          Search
        </Button>
        {Alert}
      </Stack>
    </form>
  );
}
