import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Stack,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Twitch } from '@/api';
import { useTabs } from '@/hooks';
import HiddenField from '@/components/common/HiddenField';

type TwitchSettingsProps = {
  twitch: Twitch;
  open: boolean;
  onClose: () => void;
};

const serverValidationSchema = yup.object({
  endpoint: yup.string().required('Endpoint is required'),
  port: yup.number().required('Port is required'),
});

const twitchValidationSchema = yup.object({
  clientId: yup.string().required('Client ID is required'),
  clientSecret: yup.string().required('Client Secret is required'),
});

function ServerSettingsTab({ onClose }: { onClose: () => void }) {
  const formik = useFormik({
    initialValues: {
      endpoint: 'localhost',
      port: 80,
    },
    validationSchema: serverValidationSchema,
    onReset: onClose,
    onSubmit: async (values) => {
      const { endpoint, port } = values;
      localStorage.setItem('endpoint', endpoint);
      localStorage.setItem('port', port.toString());
      onClose();
    },
  });
  return (
    <form method="dialog" onSubmit={formik.handleSubmit}>
      <DialogContent>
        <Stack gap={2}>
          <DialogContentText>
            Please provide a twitchtube server endpoint
          </DialogContentText>
          <TextField
            id="endpoint"
            name="endpoint"
            label="Endpoint"
            value={formik.values.endpoint}
            onChange={formik.handleChange}
            error={formik.touched.endpoint && Boolean(formik.errors.endpoint)}
            helperText={formik.errors.endpoint}
            onBlur={formik.handleBlur}
            size="small"
          />
          <TextField
            id="port"
            name="port"
            label="Port"
            value={formik.values.port}
            onChange={formik.handleChange}
            error={formik.touched.port && Boolean(formik.errors.port)}
            helperText={formik.errors.port}
            onBlur={formik.handleBlur}
            type="number"
            size="small"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="reset" onClick={formik.handleReset}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </form>
  );
}

function TwitchSettingsTab({
  twitch,
  onClose,
}: {
  twitch: Twitch;
  onClose: () => void;
}) {
  const formik = useFormik({
    initialValues: {
      clientId: twitch?.getClientId || '',
      clientSecret: twitch?.getClientSecret || '',
    },
    validationSchema: twitchValidationSchema,
    onReset: onClose,
    onSubmit: async (values) => {
      const { clientId, clientSecret } = values;
      localStorage.setItem('clientId', clientId);
      localStorage.setItem('clientSecret', clientSecret);
      twitch?.setClientId(clientId);
      twitch?.setClientSecret(clientSecret);
      onClose();
    },
  });
  return (
    <form method="dialog" onSubmit={formik.handleSubmit}>
      <DialogContent>
        <Stack gap={2}>
          <DialogContentText>
            Please provide your twitch client id and secret.
          </DialogContentText>
          <HiddenField
            id="clientId"
            name="clientId"
            label="Client ID"
            value={formik.values.clientId}
            onChange={formik.handleChange}
            error={formik.touched.clientId && Boolean(formik.errors.clientId)}
            size="small"
          />
          <HiddenField
            id="clientSecret"
            name="clientSecret"
            label="Client Secret"
            value={formik.values.clientSecret}
            onChange={formik.handleChange}
            error={
              formik.touched.clientSecret && Boolean(formik.errors.clientSecret)
            }
            size="small"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="reset" onClick={formik.handleReset}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </form>
  );
}

function SettingsTab({
  twitch,
  onClose,
  settings,
}: {
  twitch: Twitch;
  onClose: () => void;
  settings: string;
}) {
  switch (settings) {
    case 'server':
      return <ServerSettingsTab onClose={onClose} />;
    case 'twitch':
      return <TwitchSettingsTab twitch={twitch} onClose={onClose} />;
    default:
      return null;
  }
}

export default function TwitchSettings({
  twitch,
  open,
  onClose,
}: TwitchSettingsProps) {
  const [settings, setSettings] = useTabs('server');

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Tabs value={settings} onChange={setSettings}>
          <Tab label="Server" value="server" />
          <Tab label="Twitch" value="twitch" />
        </Tabs>
      </DialogTitle>
      <SettingsTab twitch={twitch} onClose={onClose} settings={settings} />
    </Dialog>
  );
}
