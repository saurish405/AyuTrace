import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { BatchEntry, NewBatchEntry } from '../types';
import { AddBatchForm } from '../components/AddBatchForm';
import { getBatches, addBatch, updateBatch, deleteBatch, downloadBatchAsJson } from '../utils/batchStorage';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  TablePagination,
  IconButton as MuiIconButton,
  Tooltip,
  TextField,
  InputBase,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  LocalShipping as LocalShippingIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  ArrowUpward as ArrowUpwardIcon,
  SwapHoriz as SwapHorizIcon,
  AccessTime as AccessTimeIcon,
  Inbox as InboxIcon,
  HourglassEmpty as HourglassEmptyIcon,
  CheckCircle as CheckCircleIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

// Custom styled components with new color scheme
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '24px',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '300px',
  },
  '&:focus-within': {
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: 'pending' | 'processing' | 'processed' }>(({ theme, status }) => {
  const statusColors = {
    pending: theme.palette.mode === 'dark' ? '#FFB74D' : '#FB8C00',
    processing: theme.palette.mode === 'dark' ? '#4FC3F7' : '#039BE5',
    processed: theme.palette.mode === 'dark' ? '#81C784' : '#43A047'
  };
  
  return {
    backgroundColor: statusColors[status],
    color: theme.palette.getContrastText(statusColors[status]),
    fontWeight: 600,
    fontSize: '0.75rem',
    padding: '4px 8px',
    height: '24px',
    '& .MuiChip-label': {
      padding: '0 6px',
    },
  };
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Mock data for demonstration - using only BatchEntry type properties
const mockBatches: BatchEntry[] = [
  {
    id: '1',
    batchNumber: 'BATCH-2023-001',
    herbName: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    dateReceived: '2023-09-12',
    weightReceived: 150,
    weightAfterProcessing: 140,
    createdAt: '2023-09-12T10:30:00Z',
    updatedAt: '2023-09-12T10:30:00Z'
  },
  {
    id: '2',
    batchNumber: 'BATCH-2023-002',
    herbName: 'Turmeric',
    scientificName: 'Curcuma longa',
    dateReceived: '2023-09-11',
    weightReceived: 200,
    weightAfterProcessing: 190,
    createdAt: '2023-09-11T14:15:00Z',
    updatedAt: '2023-09-11T15:45:00Z'
  },
  {
    id: '3',
    batchNumber: 'BATCH-2023-003',
    herbName: 'Tulsi',
    scientificName: 'Ocimum tenuiflorum',
    dateReceived: '2023-09-10',
    weightReceived: 120,
    weightAfterProcessing: 115,
    createdAt: '2023-09-10T09:20:00Z',
    updatedAt: '2023-09-10T09:20:00Z'
  }
];

// Profile type
type Profile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

export const Dashboard = () => {
  const [batches, setBatches] = useState<BatchEntry[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<BatchEntry | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout, toggleDarkMode, isDarkMode } = useAuth();
  const navigate = useNavigate();

  // Menu states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Load batches from local storage
  useEffect(() => {
    const loadBatches = () => {
      try {
        const storedBatches = getBatches();
        // Ensure we have some initial data if none exists
        if (storedBatches.length === 0) {
          // Initialize with mock data if no data exists
          const newBatches = mockBatches.map(batch => ({
            ...batch,
            weightReceived: Number(batch.weightReceived),
            weightAfterProcessing: Number(batch.weightAfterProcessing)
          }));
          newBatches.forEach(batch => addBatch(batch));
          setBatches(newBatches);
        } else {
          setBatches(storedBatches);
        }
      } catch (error) {
        console.error('Error loading batches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBatches();
    
    // Set up storage event listener to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ayurvedic_herb_batches') {
        loadBatches();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAddBatch = (newBatch: NewBatchEntry) => {
    try {
      // Ensure numeric values
      const batchToAdd = {
        ...newBatch,
        weightReceived: Number(newBatch.weightReceived),
        weightAfterProcessing: Number(newBatch.weightAfterProcessing)
      };
      const addedBatch = addBatch(batchToAdd);
      setBatches(prev => [...prev, addedBatch]);
      return true;
    } catch (error) {
      console.error('Error adding batch:', error);
      return false;
    }
  };

  const handleUpdateBatch = (batchData: Omit<BatchEntry, 'id' | 'createdAt' | 'updatedAt'> & { id: string }) => {
    try {
      const existingBatch = batches.find(b => b.id === batchData.id);
      if (!existingBatch) {
        console.error('Batch not found for update');
        return false;
      }
      
      // Create the update object with only the fields that can be updated
      const updateData = {
        batchNumber: batchData.batchNumber,
        herbName: batchData.herbName,
        scientificName: batchData.scientificName,
        dateReceived: batchData.dateReceived,
        weightReceived: Number(batchData.weightReceived),
        weightAfterProcessing: Number(batchData.weightAfterProcessing)
      };
      
      const result = updateBatch(batchData.id, updateData);
      
      if (result) {
        setBatches(prev => 
          prev.map(batch => 
            batch.id === batchData.id ? { ...batch, ...result } : batch
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating batch:', error);
      return false;
    }
  };

  const handleDeleteBatch = (batchId: string) => {
    if (window.confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      try {
        const success = deleteBatch(batchId);
        if (success) {
          setBatches(prev => prev.filter(batch => batch.id !== batchId));
        }
        return success;
      } catch (error) {
        console.error('Error deleting batch:', error);
        return false;
      }
    }
    return false;
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Menu handlers
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  // Render menu for mobile
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar alt={user?.name} src="/static/images/avatar/1.jpg" />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  // Render account menu
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  // Filter batches based on search term
  const filteredBatches = batches.filter(batch => {
    return (
      batch.herbName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate pagination
  const paginatedBatches = filteredBatches.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if date parsing fails
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => navigate('/')}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            HerbTrack
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <IconButton size="large" color="inherit" onClick={toggleDarkMode}>
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton size="large" color="inherit">
              <StyledBadge badgeContent={4} color="error">
                <NotificationsIcon />
              </StyledBadge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar alt={user?.name} src="/static/images/avatar/1.jpg" />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" component="h1">
                Incoming Batches
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsAddDialogOpen(true)}
              >
                Add New Entry
              </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by batch number, herb name, or scientific name..."
                size="small"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                sx={{ maxWidth: 600 }}
              />
            </Paper>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="batches table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Batch Number</TableCell>
                      <TableCell>Herb Name</TableCell>
                      <TableCell>Scientific Name</TableCell>
                      <TableCell>Date Received</TableCell>
                      <TableCell>Weight Received (kg)</TableCell>
                      <TableCell>Weight After Processing (kg)</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedBatches.length > 0 ? (
                      paginatedBatches.map((batch) => (
                        <StyledTableRow key={batch.id}>
                          <TableCell>{batch.batchNumber}</TableCell>
                          <TableCell>{batch.herbName}</TableCell>
                          <TableCell>{batch.scientificName}</TableCell>
                          <TableCell>{batch.dateReceived}</TableCell>
                          <TableCell>{batch.weightReceived.toFixed(2)}</TableCell>
                          <TableCell>{batch.weightAfterProcessing.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <Box display="flex" gap={1} justifyContent="flex-end">
                              <Tooltip title="Edit">
                                <MuiIconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => setEditingBatch(batch)}
                                >
                                  <EditIcon fontSize="small" />
                                </MuiIconButton>
                              </Tooltip>
                              <Tooltip title="Download JSON">
                                <MuiIconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => downloadBatchAsJson(batch)}
                                >
                                  <DownloadIcon fontSize="small" />
                                </MuiIconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <MuiIconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteBatch(batch.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </MuiIconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="textSecondary">
                            No batches found. Click "Add New Entry" to get started.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredBatches.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Add/Edit Batch Dialog */}
      {(isAddDialogOpen || editingBatch) && (
        <AddBatchForm 
          open={isAddDialogOpen || Boolean(editingBatch)}
          batch={editingBatch || undefined}
          onClose={() => {
            setIsAddDialogOpen(false);
            setEditingBatch(null);
          }}
          onSave={(batchData) => {
            if (editingBatch) {
              const success = handleUpdateBatch({
                ...batchData,
                id: editingBatch.id
              });
              if (success) {
                setEditingBatch(null);
              }
            } else {
              handleAddBatch(batchData);
              setIsAddDialogOpen(false);
            }
          }}
        />
      )}
    </Box>
  );
};
