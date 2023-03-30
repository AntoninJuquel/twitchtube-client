import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material';
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

import { Home, NotFound } from './pages';

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const customTheme = createTheme({});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
