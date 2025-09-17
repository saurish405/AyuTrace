import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea, 
  CardMedia,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Science as ScienceIcon,
  Inventory as InventoryIcon,
  AccountBalance as FarmerIcon
} from '@mui/icons-material';

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  disabled?: boolean;
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  color,
  disabled = false,
  onClick 
}) => (
  <Card 
    sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      },
      borderLeft: `4px solid ${color}`,
    }}
    elevation={2}
  >
    <CardActionArea 
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Icon sx={{ fontSize: 30, color }} />
      </Box>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardActionArea>
  </Card>
);

export const RoleSelection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  interface Role {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    path: string;
    disabled?: boolean;
  }

  const roles: Role[] = [
    {
      title: 'Processor',
      description: 'Manage and process incoming herb batches, track production status',
      icon: DashboardIcon,
      color: theme.palette.primary.main,
      path: '/dashboard',
      disabled: false
    },
    {
      title: 'Lab Technician',
      description: 'Perform quality tests, record results, and generate certificates',
      icon: ScienceIcon,
      color: theme.palette.secondary.main,
      path: '/lab-technician',
      disabled: false
    },
    {
      title: 'Manufacturer',
      description: 'Package products, generate QR codes, and manage inventory',
      icon: InventoryIcon,
      color: theme.palette.success.main,
      path: '/manufacturer',
      disabled: false
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Qryptix Platform
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Select your role to continue
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Grid container spacing={4} sx={{ maxWidth: '900px', justifyContent: 'center' }}>
          {roles.map((role) => (
            <Grid item xs={12} sm={5} md={4} key={role.title}>
              <RoleCard
                title={role.title}
                description={role.description}
                icon={role.icon}
                color={role.color}
                onClick={() => !role.disabled && navigate('/login', { state: { role: role.title.toLowerCase() } })}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mt={8} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Qryptix. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default RoleSelection;
