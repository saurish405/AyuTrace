import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Link, 
  Fade,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Collapse,
  CircularProgress
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff,
  Login as LoginIcon
} from '@mui/icons-material';

export const Login = () => {
  const location = useLocation();
  const role = (location.state as { role?: string })?.role;
  const [email, setEmail] = useState(role === 'lab-technician' ? 'lab@example.com' : role === 'manufacturer' ? 'manufacturer@example.com' : 'processor@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getDashboardName = () => {
    switch(role) {
      case 'lab-technician':
        return 'Lab Technician Dashboard';
      case 'manufacturer':
        return 'Manufacturer Dashboard';
      case 'processor':
      default:
        return 'Processor Dashboard';
    }
  };

  const getDashboardPath = (userRole: string) => {
    switch(userRole) {
      case 'lab-technician':
        return '/lab-technician';
      case 'manufacturer':
        return '/manufacturer';
      case 'processor':
      default:
        return '/dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        // Redirect to the appropriate dashboard based on user role
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const dashboardPath = getDashboardPath(user.role);
        navigate(dashboardPath, { replace: true });
      } else {
        setError(role ? 'Invalid credentials for selected role' : 'Invalid email or password');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
        py: 8,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={6} 
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              p: 3,
              textAlign: 'center'
            }}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Qryptix {getDashboardName()}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
                {role ? `Please sign in to continue to ${getDashboardName()}` : 'Ayurvedic Herb Processing Dashboard'}
              </Typography>
            </Box>
            
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="h5" component="h2" align="center" fontWeight="medium" gutterBottom>
                Welcome Back
              </Typography>
              <Typography color="text.secondary" align="center" sx={{ mb: 4 }}>
                Sign in to continue to your dashboard
              </Typography>

              <Collapse in={!!error} sx={{ mb: 2 }}>
                <Alert severity="error" onClose={() => setError('')}>
                  {error}
                </Alert>
              </Collapse>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Link href="#" variant="body2" color="primary">
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  size="large"
                  startIcon={!isLoading && <LoginIcon />}
                  sx={{
                    mt: 2,
                    mb: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 'medium',
                    boxShadow: '0 4px 14px 0 rgba(0, 118, 244, 0.39)',
                    '&:hover': {
                      boxShadow: '0 6px 20px 0 rgba(0, 118, 244, 0.5)',
                    },
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={24} color="inherit" />
                      <Box component="span" sx={{ ml: 1.5 }}>Signing in...</Box>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Divider sx={{ my: 3 }}>or</Divider>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Don't have an account?
                  </Typography>
                  <Link href="#" variant="body1" fontWeight="medium">
                    Request Access
                  </Link>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {new Date().getFullYear()} Qryptix All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
