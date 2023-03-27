import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  TextField,
  Button,
  ButtonGroup,
  Stack,
  Breadcrumbs,
} from '@mui/material';

import GamesIcon from '@mui/icons-material/SportsEsports';
import BroadcasterIcon from '@mui/icons-material/Person';

import Save from '@mui/icons-material/Save';
import Upload from '@mui/icons-material/Upload';

import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs from 'dayjs';

import { Twitch, TwitchClip } from '@/api/Twitch';

const validationSchema = yup.object({
  type: yup.string().required('Type is required'),
  name: yup.string().required('Name is required'),
  max: yup.number().min(1).max(100).required('Max is required'),
  start: yup.date().required('Start is required'),
  end: yup.date().required('End is required'),
});

type FormProps = {
  twitch: Twitch;
  onGetClips: (clips: TwitchClip[]) => void;
};

export type TwitchFormParams = {
  type: string;
  name: string;
  max: number;
  start: string;
  end: string;
};

export default function TwitchForm({ twitch, onGetClips }: FormProps) {
  const formik = useFormik({
    initialValues: {
      type: 'games',
      name: '',
      max: 10,
      start: dayjs().subtract(1, 'day').toISOString(),
      end: dayjs().toISOString(),
    },
    validationSchema,
    onSubmit: async (values) => {
      switch (values.type) {
        case 'games': {
          const game = await twitch.getGameByName(values.name);
          const clips = await twitch.getClips({
            game_id: game.id,
            started_at: values.start,
            ended_at: values.end,
            first: values.max,
          });
          onGetClips(clips.data);
          break;
        }
        case 'broadcaster': {
          const broadcaster = await twitch.getUserByName(values.name);
          const clips = await twitch.getClips({
            broadcaster_id: broadcaster.id,
            started_at: values.start,
            ended_at: values.end,
            first: values.max,
          });
          onGetClips(clips.data);
          break;
        }

        default:
          break;
      }
    },
  });

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button
        onClick={() => {
          alert(`${JSON.stringify(formik.values, null, 2)}`);
        }}
      >
        <Save />
      </Button>
      <Button>
        <Upload />
      </Button>

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
              variant={
                formik.values.type === 'games' ? 'contained' : 'outlined'
              }
              onClick={() => {
                formik.setFieldValue('type', 'games');
              }}
            >
              <GamesIcon />
            </Button>
            <Button
              variant={
                formik.values.type === 'broadcaster' ? 'contained' : 'outlined'
              }
              onClick={() => {
                formik.setFieldValue('type', 'broadcaster');
              }}
            >
              <BroadcasterIcon />
            </Button>
          </ButtonGroup>
          <TextField
            id="name"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            id="max"
            label="Max"
            type="number"
            InputProps={{
              inputProps: { min: 1, max: 100 },
            }}
            value={formik.values.max}
            onChange={formik.handleChange}
            error={formik.touched.max && Boolean(formik.errors.max)}
            helperText={formik.touched.max && formik.errors.max}
          />
          <Breadcrumbs separator="-">
            <MobileDateTimePicker
              label="Start"
              value={dayjs(formik.values.start)}
              onAccept={(e) =>
                formik.handleChange('start')(e?.toISOString() ?? '')
              }
            />

            <MobileDateTimePicker
              label="End"
              value={dayjs(formik.values.end)}
              onAccept={(e) =>
                formik.handleChange('end')(e?.toISOString() ?? '')
              }
            />
          </Breadcrumbs>
          <Button color="primary" variant="contained" type="submit">
            Search
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
