import { useState } from 'react';
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
import HiddenField from '../common/HiddenField';

type TwitchSettingsProps = {
  twitch: Twitch;
  open: boolean;
  onClose: () => void;
};

const validationSchema = yup.object({
  clientId: yup.string().required('Client ID is required'),
  clientSecret: yup.string().required('Client Secret is required'),
  endpoint: yup.string().required('Endpoint is required'),
  port: yup.number().required('Port is required'),
});

function TwitchSettings({ twitch, open, onClose }: TwitchSettingsProps) {
  const formik = useFormik({
    initialValues: {
      clientId: twitch?.getClientId || '',
      clientSecret: twitch?.getClientSecret || '',
      endpoint: 'localhost',
      port: 80,
    },
    validationSchema,
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

  const [tab, setTab] = useState('server');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form method="dialog" onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Tabs value={tab} onChange={handleChange}>
            <Tab label="Server" value="server" />
            <Tab label="Twitch" value="twitch" />
          </Tabs>
        </DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            {tab === 'server' && (
              <>
                <DialogContentText>
                  Please provide a twitchtube server endpoint
                </DialogContentText>
                <TextField
                  id="endpoint"
                  name="endpoint"
                  label="Endpoint"
                  value={formik.values.endpoint}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.endpoint && Boolean(formik.errors.endpoint)
                  }
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
              </>
            )}
            {tab === 'twitch' && (
              <>
                <DialogContentText>
                  Please provide your twitch client id and secret.
                </DialogContentText>
                <HiddenField
                  id="clientId"
                  name="clientId"
                  label="Client ID"
                  value={formik.values.clientId}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.clientId && Boolean(formik.errors.clientId)
                  }
                  size="small"
                />
                <HiddenField
                  id="clientSecret"
                  name="clientSecret"
                  label="Client Secret"
                  value={formik.values.clientSecret}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.clientSecret &&
                    Boolean(formik.errors.clientSecret)
                  }
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

export default TwitchSettings;
