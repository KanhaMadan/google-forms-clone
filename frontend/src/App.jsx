import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import FormBuilder from './components/FormBuilder';
import FormList from './components/FormList';
import FormFill from './pages/FormFill';
import ResponsesView from './pages/ResponsesView';

const theme = createTheme({
  palette: {
    primary: {
      main: '#673ab7',
    },
    secondary: {
      main: '#03a9f4',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/forms" replace />} />
          <Route path="/admin/forms" element={<FormList />} />
          <Route path="/admin/create" element={<FormBuilder />} />
          <Route path="/admin/responses/:formId" element={<ResponsesView />} />
          <Route path="/form/:formId" element={<FormFill />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;