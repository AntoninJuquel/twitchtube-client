import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import { ThemeProvider, createTheme, Tabs, Tab, Box, Stack } from '@mui/material';
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

import { Twitch, Video } from '@/pages';
import { VideoContextProvider } from '@/contexts/VideoContext';
import Settings from '@/components/Settings';

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const customTheme = createTheme({});

type TabItemProps = {
  page: string;
  value: string;
  Component: () => JSX.Element;
};

function TabItem({ page, value, Component }: TabItemProps) {
  return (
    <Box display={page === value ? 'block' : 'none'} flex={1}>
      <Component />
    </Box>
  );
}

function App() {
  const [page, setPage] = useState('twitch');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setPage(newValue);
  };
  return (
    <Stack direction="column" width="100vw" height="100vh">
      <Settings />
      <Tabs value={page} onChange={handleChange} textColor="inherit">
        <Tab label="Twitch" value="twitch" />
        <Tab label="Video" value="video" />
      </Tabs>
      <TabItem page={page} value="twitch" Component={Twitch} />
      <TabItem page={page} value="video" Component={Video} />
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
