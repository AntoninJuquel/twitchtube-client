import { useState } from 'react';
import { useToggle } from 'usehooks-ts';
import { useFormik } from 'formik';
import { sub } from 'date-fns';
import * as yup from 'yup';
import {
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Icon,
  Stack,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TwitchClipType } from '@/types/twitch';
import * as api from '@/api';
import { GenericTwitchResponse, TwitchClip } from 'twitch-api-helix';

const validationSchema = yup.object({
  type: yup.string().required('Type is required'),
  name: yup.string().required('Name is required'),
  first: yup.number().min(1).max(100).required('Max is required'),
  start: yup.date().required('Start is required'),
  end: yup.date().required('End is required'),
});

const typeLabel: Record<TwitchClipType, string> = {
  game: 'Game name',
  user: 'Broadcaster name',
};

type CustomPeriodButtonProps = {
  start: Date;
  end: Date;
  onSubmit: (start: Date, end: Date) => void;
};

function CustomPeriodButton({ start, end, onSubmit }: CustomPeriodButtonProps) {
  const [open, toggleDialog] = useToggle(false);
  const [startDate, setStartDate] = useState<Date | null>(start);
  const [endDate, setEndDate] = useState<Date | null>(end);
  return (
    <>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          setStartDate(start);
          setEndDate(end);
          toggleDialog();
        }}
      >
        <Icon>event</Icon>
      </IconButton>
      <Dialog
        open={open}
        onClose={(e) => {
          (e as Event)?.stopPropagation?.();
          toggleDialog();
        }}
        maxWidth="lg"
      >
        <DialogContent
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Breadcrumbs separator="-">
            <DateCalendar value={startDate} onChange={setStartDate} />
            <DateCalendar value={endDate} onChange={setEndDate} />
          </Breadcrumbs>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleDialog();
            }}
          >
            Close
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleDialog();
              if (!startDate || !endDate) return;
              onSubmit(startDate, endDate);
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

type Props = {
  onSubmit: () => void;
  handleResult: (values: GenericTwitchResponse<TwitchClip>) => void;
  handleError: (error: Error) => void;
};

export default function TwitchForm({ onSubmit, handleResult, handleError }: Props) {
  const formik = useFormik({
    isInitialValid: false,
    validationSchema,
    initialValues: {
      type: TwitchClipType.game,
      name: '',
      first: 10,
      start: sub(new Date(), { weeks: 1 }),
      end: new Date(),
    },
    onSubmit: async (values) => {
      onSubmit();
      await api
        .getTwitchClips(values)
        .then((res) => {
          handleResult(res.data);
        })
        .catch((error) => handleError(new Error(error.response?.data?.message || 'Unknown error')));
    },
  });

  const { values, errors, isValid, handleChange, handleSubmit, setFieldValue } = formik;

  const handleChangeToggleButton = (event: React.MouseEvent<HTMLElement>, newType: string) => {
    event.stopPropagation();
    setFieldValue('type', newType);
  };

  const [period, setPeriod] = useState('weeks');
  const handleChangeSelect = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setFieldValue('start', sub(new Date(), { [value]: 1 }));
    setFieldValue('end', new Date());
    setPeriod(event.target.value);
  };
  const handleCustomPeriod = (start: Date, end: Date) => {
    setFieldValue('start', start);
    setFieldValue('end', end);
    setPeriod('custom');
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction={matches ? 'row' : 'column'} spacing={2} alignItems="center">
        <ToggleButtonGroup
          id="type"
          aria-label="type"
          color="primary"
          value={values.type}
          onChange={handleChangeToggleButton}
          exclusive
          size="small"
        >
          <ToggleButton value={TwitchClipType.game}>
            <Icon>sports_esports</Icon>
          </ToggleButton>
          <ToggleButton value={TwitchClipType.user}>
            <Icon>person</Icon>
          </ToggleButton>
        </ToggleButtonGroup>
        <TextField
          id="name"
          name="name"
          label={typeLabel[values.type]}
          variant="outlined"
          size="small"
          onClick={(e) => e.stopPropagation()}
          value={values.name}
          onChange={handleChange}
          error={!!errors.name}
        />
        <TextField
          id="first"
          name="first"
          label="Max"
          variant="outlined"
          size="small"
          type="number"
          InputProps={{
            inputProps: { min: 1, max: 100 },
          }}
          onClick={(e) => e.stopPropagation()}
          value={values.first}
          onChange={handleChange}
        />
        <FormControl>
          <InputLabel id="period" size="small">
            Period
          </InputLabel>
          <Select
            labelId="period"
            id="period"
            label="Period"
            value={period}
            onChange={handleChangeSelect}
            size="small"
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem value="years">This Year</MenuItem>
            <MenuItem value="months">This Month</MenuItem>
            <MenuItem value="weeks">This week</MenuItem>
            <MenuItem value="days">This day</MenuItem>
            <MenuItem
              value="custom"
              hidden
              style={{
                display: 'none',
              }}
            >
              {values.start?.toLocaleDateString() ?? ''} - {values.end?.toLocaleDateString() ?? ''}
            </MenuItem>
          </Select>
        </FormControl>
        <CustomPeriodButton start={values.start} end={values.end} onSubmit={handleCustomPeriod} />
        <Button
          variant="contained"
          type="submit"
          onClick={(e) => e.stopPropagation()}
          disabled={!isValid}
        >
          Search
        </Button>
      </Stack>
    </form>
  );
}
