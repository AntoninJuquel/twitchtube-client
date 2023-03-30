import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Stack,
  TextField,
} from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';

import * as api from '@/api';
import { useAlert, useTabs } from '@/hooks';
import HiddenField from '@/components/common/HiddenField';

type TwitchSettingsProps = {
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
  const { SnackbarAlert, showAlert } = useAlert();
  const formik = useFormik({
    initialValues: {
      endpoint: localStorage.getItem('endpoint') || 'localhost',
      port: parseInt(localStorage.getItem('port') || '3000', 10),
    },
    validationSchema: serverValidationSchema,
    onReset: onClose,
    onSubmit: async (values) => {
      const { endpoint, port } = values;

      api
        .setBaseURL(endpoint, port)
        .then(() => {
          showAlert({
            message: 'Server config saved successfully',
            severity: 'success',
            snackbar: {
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
              },
            },
          });
          localStorage.setItem('endpoint', endpoint);
          localStorage.setItem('port', port.toString());
        })
        .catch((err) => {
          showAlert({
            message: err.message,
            severity: 'error',
            snackbar: {
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
              },
            },
          });
        });
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
          {SnackbarAlert}
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

function TwitchSettingsTab({ onClose }: { onClose: () => void }) {
  const { SnackbarAlert, showAlert } = useAlert();
  const formik = useFormik({
    initialValues: {
      clientId: '',
      clientSecret: '',
    },
    validationSchema: twitchValidationSchema,
    onReset: onClose,
    onSubmit: async (values) => {
      const { clientId, clientSecret } = values;
      api
        .postTwitchConfig({ clientId, clientSecret })
        .then(() => {
          showAlert({
            message: 'Twitch config saved successfully',
            severity: 'success',
            snackbar: {
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
              },
            },
          });
        })
        .catch((err) => {
          showAlert({
            message: err.message,
            severity: 'error',
            snackbar: {
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
              },
            },
          });
        });
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
          {SnackbarAlert}
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
  onClose,
  settings,
}: {
  onClose: () => void;
  settings: string;
}) {
  switch (settings) {
    case 'server':
      return <ServerSettingsTab onClose={onClose} />;
    case 'twitch':
      return <TwitchSettingsTab onClose={onClose} />;
    default:
      return null;
  }
}

export default function TwitchSettings({ open, onClose }: TwitchSettingsProps) {
  const { Tabs, activeTab } = useTabs('server', [
    {
      label: 'Server',
      value: 'server',
    },
    {
      label: 'Twitch',
      value: 'twitch',
    },
  ]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{Tabs}</DialogTitle>
      <SettingsTab onClose={onClose} settings={activeTab} />
    </Dialog>
  );
}
