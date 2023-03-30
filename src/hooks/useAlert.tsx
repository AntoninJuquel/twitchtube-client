import { useCallback, useMemo, useState } from 'react';
import {
  AlertTitle,
  Fade,
  IconButton,
  AlertColor,
  Alert as MuiAlert,
  Icon,
  Snackbar,
} from '@mui/material';

type SnackbarAlert = {
  autoHideDuration?: number;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
};

type AlertMessage = {
  title?: string;
  show?: boolean;
  message: string;
  severity: AlertColor;
  snackbar?: SnackbarAlert;
};

export default function useAlert() {
  const [alert, setAlert] = useState<AlertMessage>({
    show: false,
    message: '',
    severity: 'success',
  });

  const showAlert = useCallback(
    (alertMessage: AlertMessage) => {
      setAlert({ ...alertMessage, show: true });
    },
    [setAlert]
  );

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, show: false }));
  }, [setAlert]);

  const Alert = useMemo(
    () => (
      <Fade in={alert.show}>
        <MuiAlert
          severity={alert.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={hideAlert}
            >
              <Icon>close</Icon>
            </IconButton>
          }
        >
          {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
          {alert.message}
        </MuiAlert>
      </Fade>
    ),
    [alert, hideAlert]
  );

  const SnackbarAlert = useMemo(
    () => (
      <Snackbar
        open={alert.show}
        autoHideDuration={alert.snackbar?.autoHideDuration}
        anchorOrigin={alert.snackbar?.anchorOrigin}
      >
        <MuiAlert severity={alert.severity}>
          {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
          {alert.message}
        </MuiAlert>
      </Snackbar>
    ),
    [alert]
  );

  return { Alert, SnackbarAlert, showAlert, hideAlert };
}
