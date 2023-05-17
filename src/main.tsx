import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import { ThemeProvider, createTheme, Tabs, Tab, Box, Stack, Divider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { setChonkyDefaults } from '@aperturerobotics/chonky';
import { ChonkyIconFA } from '@aperturerobotics/chonky-icon-fontawesome';

import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'reactflow/dist/style.css';

import { Monitoring, Twitch, Video } from '@/pages';
import { VideoContextProvider } from '@/contexts/VideoContext';
import Settings from '@/components/Settings';

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const customTheme = createTheme({});

type TabItemProps = {
  page: string;
  value: string;
  Component: () => JSX.Element;
  unmountOnExit?: boolean;
};

function TabItem({ page, value, Component, unmountOnExit }: TabItemProps) {
  if (unmountOnExit && page !== value) return null;

  return (
    <Box display={page === value ? 'block' : 'none'} flex={1}>
      <Component />
    </Box>
  );
}

TabItem.defaultProps = {
  unmountOnExit: false,
};

function App() {
  const [page, setPage] = useState('twitch');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setPage(newValue);
  };
  return (
    <Stack direction="column" width="100%" height="100vh">
      <Settings />
      <Tabs
        value={page}
        onChange={handleChange}
        textColor="inherit"
        sx={{
          position: 'fixed',
          width: '100%',
          zIndex: 100,
          backgroundColor: 'primary.contrastText',
        }}
      >
        <Tab label="Twitch" value="twitch" />
        <Tab label="Video" value="video" />
        <Tab label="Monitoring" value="monitoring" />
      </Tabs>
      <Tabs />
      <Divider />
      <TabItem page={page} value="twitch" Component={Twitch} />
      <TabItem page={page} value="video" Component={Video} />
      <TabItem page={page} value="monitoring" Component={Monitoring} />
    </Stack>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <VideoContextProvider>
          <App />
        </VideoContextProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
