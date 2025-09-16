import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Container, Paper, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  InputAdornment, Divider, Card, CardContent, Grid, Menu, MenuItem,
  FormControl, InputLabel, Select, SelectChangeEvent
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  QrCode as QrCodeIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';

interface ProductBatch {
  id: string;
  batchNumber: string;
  herbName: string;
  source: string;
  testDate: string;
  qualityGrade: 'A' | 'B' | 'C';
  status: 'pending' | 'packaged' | 'shipped';
  packageDetails?: {
    packageId: string;
    size: string;
    productionDate: string;
    expiryDate: string;
    qrCode: string;
  };
}

export const ManufacturerDashboard = () => {
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<ProductBatch | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [packageDetails, setPackageDetails] = useState({
    packageId: `PKG-${Math.floor(100000 + Math.random() * 900000)}`,
    size: '1kg',
    productionDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAction, setSelectedAction] = useState<{batchId: string, action: string} | null>(null);
  const navigate = useNavigate();

  // Mock data
  useEffect(() => {
    const mockBatches: ProductBatch[] = [
      {
        id: '1',
        batchNumber: 'BATCH-2023-101',
        herbName: 'Ashwagandha',
        source: 'Farm: Green Valley Herbs',
        testDate: '2023-09-15',
        qualityGrade: 'A',
        status: 'pending',
      },
      {
        id: '2',
        batchNumber: 'BATCH-2023-102',
        herbName: 'Turmeric',
        source: 'Farm: Golden Roots',
        testDate: '2023-09-16',
        qualityGrade: 'A',
        status: 'packaged',
        packageDetails: {
          packageId: 'PKG-123456',
          size: '500g',
          productionDate: '2023-09-16',
          expiryDate: '2024-09-16',
          qrCode: 'https://qryptix.com/track/PKG-123456',
        },
      },
    ];
    setBatches(mockBatches);
  }, []);

  const handleOpenDialog = (batch: ProductBatch) => {
    setSelectedBatch(batch);
    if (batch.packageDetails) {
      setPackageDetails(batch.packageDetails);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBatch(null);
    setPackageDetails({
      packageId: `PKG-${Math.floor(100000 + Math.random() * 900000)}`,
      size: '1kg',
      productionDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  const handlePackageBatch = () => {
    if (!selectedBatch) return;
    
    const updatedBatches = batches.map(batch => {
      if (batch.id === selectedBatch.id) {
        return {
          ...batch,
          status: 'packaged' as const,
          packageDetails: {
            ...packageDetails,
            qrCode: `https://qryptix.com/track/${packageDetails.packageId}`,
          }
        };
      }
      return batch;
    });
    
    setBatches(updatedBatches);
    handleCloseDialog();
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, batchId: string, action: string) => {
    event.stopPropagation();
    setSelectedAction({ batchId, action });
    setAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedAction(null);
  };

  const handleActionSelect = (action: string) => {
    if (!selectedAction) return;
    
    const updatedBatches = batches.map(batch => {
      if (batch.id === selectedAction.batchId) {
        return {
          ...batch,
          status: action === 'markShipped' ? 'shipped' : batch.status,
        };
      }
      return batch;
    });
    
    setBatches(updatedBatches);
    handleActionClose();
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending Packaging" color="warning" />;
      case 'packaged':
        return <Chip label="Packaged" color="info" />;
      case 'shipped':
        return <Chip label="Shipped" color="success" />;
      default:
        return <Chip label={status} />;
    }
  };

  const handlePrintQR = () => {
    // In a real app, this would open the print dialog for the QR code
    window.print();
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth={false}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Manufacturer Dashboard
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              sx={{ mr: 2 }}
            >
              Filters
            </Button>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search batches..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InventoryIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Pending Packaging
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {batches.filter(b => b.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ready for packaging
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <QrCodeIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Packaged
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {batches.filter(b => b.status === 'packaged').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ready for shipping
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalShippingIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Shipped
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {batches.filter(b => b.status === 'shipped').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In distribution
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2">
              Product Batches
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Batch #</TableCell>
                  <TableCell>Herb Name</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Test Date</TableCell>
                  <TableCell>Quality</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow 
                    key={batch.id} 
                    hover 
                    onClick={() => handleOpenDialog(batch)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{batch.batchNumber}</TableCell>
                    <TableCell>{batch.herbName}</TableCell>
                    <TableCell>{batch.source}</TableCell>
                    <TableCell>{new Date(batch.testDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`Grade ${batch.qualityGrade}`} 
                        color={
                          batch.qualityGrade === 'A' ? 'success' : 
                          batch.qualityGrade === 'B' ? 'info' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{getStatusChip(batch.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(e, batch.id, batch.status);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Package Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedBatch?.packageDetails ? 'Package Details' : 'Create Package'}
          <Typography variant="subtitle2" color="text.secondary">
            {selectedBatch?.batchNumber} - {selectedBatch?.herbName}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Package ID"
                value={packageDetails.packageId}
                onChange={(e) => setPackageDetails({...packageDetails, packageId: e.target.value})}
                margin="normal"
                required
                disabled={!!selectedBatch?.packageDetails}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Package Size</InputLabel>
                <Select
                  value={packageDetails.size}
                  label="Package Size"
                  onChange={(e: SelectChangeEvent) => 
                    setPackageDetails({...packageDetails, size: e.target.value as string})
                  }
                >
                  <MenuItem value="100g">100g</MenuItem>
                  <MenuItem value="250g">250g</MenuItem>
                  <MenuItem value="500g">500g</MenuItem>
                  <MenuItem value="1kg">1kg</MenuItem>
                  <MenuItem value="5kg">5kg</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Production Date"
                type="date"
                value={packageDetails.productionDate}
                onChange={(e) => setPackageDetails({...packageDetails, productionDate: e.target.value})}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={packageDetails.expiryDate}
                onChange={(e) => setPackageDetails({...packageDetails, expiryDate: e.target.value})}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                p: 2,
                border: '1px dashed #ccc',
                borderRadius: 1,
                height: '100%',
                justifyContent: 'center'
              }}>
                <QRCodeSVG 
                  value={packageDetails.packageId ? `https://qryptix.com/track/${packageDetails.packageId}` : ''} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <Typography variant="caption" align="center" sx={{ mt: 2, wordBreak: 'break-all' }}>
                  {packageDetails.packageId}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<PrintIcon />}
                    onClick={handlePrintQR}
                  >
                    Print
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<DownloadIcon />}
                  >
                    Download
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          {!selectedBatch?.packageDetails && (
            <Button 
              onClick={handlePackageBatch} 
              variant="contained" 
              color="primary"
              disabled={!packageDetails.packageId || !packageDetails.size}
            >
              Create Package
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        onClick={handleActionClose}
      >
        <MenuItem onClick={() => handleActionSelect('viewDetails')}>
          View Details
        </MenuItem>
        <MenuItem 
          onClick={() => handleActionSelect('printLabel')}
          disabled={selectedAction?.action === 'pending'}
        >
          Print Label
        </MenuItem>
        <MenuItem 
          onClick={() => handleActionSelect('markShipped')}
          disabled={selectedAction?.action === 'pending'}
        >
          Mark as Shipped
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleActionSelect('delete')}>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ManufacturerDashboard;
