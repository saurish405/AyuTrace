import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { RoleSelection } from './pages/RoleSelection';
import ProcessBatch from './pages/ProcessBatch';
import LabTechnicianDashboard from './pages/LabTechnicianDashboard';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import { lightTheme, darkTheme } from './theme';

// Simple wrapper component (no authentication check)
const AppContainer = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<Login />} />
    
    {/* Main routes */}
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/role-selection" element={<RoleSelection />} />
    <Route path="/lab-technician" element={<LabTechnicianDashboard />} />
    <Route path="/manufacturer" element={<ManufacturerDashboard />} />
    <Route path="/process-batch/:id" element={<ProcessBatch />} />
    
    {/* Redirect root to role selection */}
    <Route path="/" element={<Navigate to="/role-selection" replace />} />
    
    {/* Catch-all route */}
    <Route path="*" element={<Navigate to="/role-selection" replace />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Router>
          <AppContainer>
            <AppRoutes />
          </AppContainer>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
