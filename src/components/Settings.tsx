import { useState } from 'react';
import { useToggle } from 'usehooks-ts';
import {
  Fab,
  Icon,
  Dialog,
  DialogActions,
  DialogContent,
  Tabs,
  Tab,
  Stack,
  Button,
  TextField,
  Breadcrumbs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';

type SettingsProps = {
  values: any;
  handleChange: any;
};

function GeneralSettings({ values, handleChange }: SettingsProps) {
  return (
    <Stack spacing={2}>
      <TextField
        size="small"
        name="endpoint"
        label="Server endpoint"
        value={values.endpoint}
        onChange={handleChange}
      />
      <TextField
        size="small"
        name="port"
        label="Server port"
        type="number"
        value={values.port}
        onChange={handleChange}
      />
    </Stack>
  );
}

function TwitchSettings({ values, handleChange }: SettingsProps) {
  return (
    <Stack spacing={2}>
      <TextField
        size="small"
        name="clientId"
        label="Client Id"
        type="password"
        value={values.clientId}
        onChange={handleChange}
      />
      <TextField
        size="small"
        name="clientSecret"
        label="Client Secret"
        type="password"
        value={values.clientSecret}
        onChange={handleChange}
      />
    </Stack>
  );
}

function VideoSettings({ values, handleChange }: SettingsProps) {
  return (
    <Stack spacing={2}>
      <Breadcrumbs separator="x">
        <TextField
          size="small"
          name="width"
          label="Width"
          type="number"
          sx={{
            width: 93,
          }}
          value={values.width}
          onChange={handleChange}
        />
        <TextField
          size="small"
          name="height"
          label="Height"
          type="number"
          sx={{
            width: 93,
          }}
          value={values.height}
          onChange={handleChange}
        />
      </Breadcrumbs>
      <TextField
        size="small"
        name="fps"
        label="FPS"
        type="number"
        value={values.fps}
        onChange={handleChange}
        id="fps"
      />
    </Stack>
  );
}

function NotificationSettings({ values, handleChange }: SettingsProps) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <FormControl>
          <InputLabel id="period" size="small">
            Period
          </InputLabel>
          <Select
            labelId="period"
            id="period"
            label="Period"
            // value={period}
            // onChange={handleChangeSelect}
            size="small"
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem value="tel">tel</MenuItem>
            <MenuItem value="email">email</MenuItem>
          </Select>
        </FormControl>
        <TextField size="small" name="notifications" label="Notifications" id="notifications" />
      </Stack>
      <Stack direction="row" spacing={2}>
        <FormControl>
          <InputLabel id="period" size="small">
            Period
          </InputLabel>
          <Select
            labelId="period"
            id="period"
            label="Period"
            // value={period}
            // onChange={handleChangeSelect}
            size="small"
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem value="tel">tel</MenuItem>
            <MenuItem value="email">email</MenuItem>
          </Select>
        </FormControl>
        <TextField size="small" name="notifications" label="Notifications" id="notifications" />
      </Stack>
    </Stack>
  );
}

const SettingsTabs = [
  { label: 'General', Component: GeneralSettings },
  { label: 'Twitch', Component: TwitchSettings },
  { label: 'Video', Component: VideoSettings },
  { label: 'Notification', Component: NotificationSettings },
];

export default function Settings() {
  const [open, toggleOpen] = useToggle(false);
  const [tab, setTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  const formik = useFormik({
    initialValues: {
      endpoint: 'localhost',
      port: 3000,
      clientId: '',
      clientSecret: '',
      width: 1280,
      height: 720,
      fps: 30,
      notifications: [],
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const { values, handleChange, handleSubmit } = formik;

  return (
    <>
      <Fab
        color="primary"
        onClick={toggleOpen}
        size="small"
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
        }}
      >
        <Icon>settings</Icon>
      </Fab>
      <Dialog open={open} onClose={toggleOpen} fullWidth>
        <Stack direction="row" spacing={2}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            orientation="vertical"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            {SettingsTabs.map((settingTab) => (
              <Tab key={settingTab.label} label={settingTab.label} />
            ))}
          </Tabs>
          <form
            onSubmit={handleSubmit}
            style={{
              flex: 1,
            }}
          >
            <Stack spacing={2} flexGrow={1}>
              <DialogContent>{SettingsTabs[tab].Component({ values, handleChange })}</DialogContent>
              <DialogActions>
                <Button onClick={toggleOpen}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogActions>
            </Stack>
          </form>
        </Stack>
      </Dialog>
    </>
  );
}
