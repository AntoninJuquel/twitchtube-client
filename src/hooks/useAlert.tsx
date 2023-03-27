import { useCallback, useMemo, useState } from 'react';
import {
  AlertTitle,
  Fade,
  IconButton,
  AlertColor,
  Alert as MuiAlert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type AlertMessage = {
  title?: string;
  show?: boolean;
  message: string;
  severity: AlertColor;
};

export default function useAlert() {
  const [alert, setAlert] = useState<AlertMessage>({
    show: false,
    message: '',
    severity: 'success',
  });

  const showAlert = useCallback(
    ({ title, message, severity }: AlertMessage) => {
      setAlert({ title, message, severity, show: true });
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
              <CloseIcon fontSize="inherit" />
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

  return { Alert, showAlert, hideAlert };
}
