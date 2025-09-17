import React, { useState } from 'react';
import { 
  Box, Typography, Container, Paper, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Grid, Snackbar, Alert
} from '@mui/material';
import { 
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';

interface ProductBatch {
  id: string;
  batchNumber: string;
  herbName: string;
  scientificName: string;
  receiveDate: string;
  packagingDate: string;
  productFormed: string;
  plantLocation: string;
  notes: string;
}

const ManufacturerDashboard = () => {
  const [products, setProducts] = useState<ProductBatch[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Omit<ProductBatch, 'id'>>({
    batchNumber: '',
    herbName: '',
    scientificName: '',
    receiveDate: new Date().toISOString().split('T')[0],
    packagingDate: new Date().toISOString().split('T')[0],
    productFormed: '',
    plantLocation: '',
    notes: ''
  });

  const handleOpenDialog = (product?: ProductBatch) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        batchNumber: product.batchNumber,
        herbName: product.herbName,
        scientificName: product.scientificName,
        receiveDate: product.receiveDate,
        packagingDate: product.packagingDate,
        productFormed: product.productFormed,
        plantLocation: product.plantLocation,
        notes: product.notes
      });
    } else {
      setEditingId(null);
      setFormData({
        batchNumber: '',
        herbName: '',
        scientificName: '',
        receiveDate: new Date().toISOString().split('T')[0],
        packagingDate: new Date().toISOString().split('T')[0],
        productFormed: '',
        plantLocation: '',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Update existing
      setProducts(products.map(item => 
        item.id === editingId ? { ...formData, id: editingId } : item
      ));
      setSnackbarMessage('Product updated successfully');
    } else {
      // Add new
      const newProduct = {
        ...formData,
        id: Date.now().toString()
      };
      setProducts([...products, newProduct]);
      setSnackbarMessage('Product added successfully');
    }
    setOpenDialog(false);
    setOpenSnackbar(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(item => item.id !== id));
      setSnackbarMessage('Product deleted successfully');
      setOpenSnackbar(true);
    }
  };

  const filteredProducts = products.filter(product => 
    product.herbName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateQRCode = (product: ProductBatch) => {
    const qrData = {
      batchNumber: product.batchNumber,
      herbName: product.herbName,
      scientificName: product.scientificName,
      packagingDate: product.packagingDate,
      productFormed: product.productFormed,
      plantLocation: product.plantLocation
    };
    return JSON.stringify(qrData);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth={false}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Manufacturer Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon color="action" sx={{ mr: 1 }} />
                ),
              }}
            />
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add New Product
            </Button>
          </Box>
        </Box>

        <Paper sx={{ mt: 2, p: 3, borderRadius: 2, boxShadow: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Batch #</TableCell>
                  <TableCell>Herb Name</TableCell>
                  <TableCell>Product Formed</TableCell>
                  <TableCell>Packaging Date</TableCell>
                  <TableCell>Plant Location</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>{product.batchNumber}</TableCell>
                      <TableCell>{product.herbName}</TableCell>
                      <TableCell>{product.productFormed}</TableCell>
                      <TableCell>{new Date(product.packagingDate).toLocaleDateString()}</TableCell>
                      <TableCell>{product.plantLocation}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleOpenDialog(product)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => {
                            // QR code functionality will be added later
                            const qrData = generateQRCode(product);
                            console.log('QR Code Data:', qrData);
                            // In a real app, this would open a dialog with the QR code
                            alert('QR Code functionality will be implemented later');
                          }}
                        >
                          <QrCodeIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">
                        {searchTerm ? 'No matching products found' : 'No products available'}
                      </Typography>
                      {!searchTerm && (
                        <Button 
                          variant="outlined" 
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenDialog()}
                          sx={{ mt: 2 }}
                        >
                          Add Product
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Product Form Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {editingId ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Batch Number"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Herb Name"
                    value={formData.herbName}
                    onChange={(e) => setFormData({...formData, herbName: e.target.value})}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Scientific Name"
                    value={formData.scientificName}
                    onChange={(e) => setFormData({...formData, scientificName: e.target.value})}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Receive Date"
                    type="date"
                    value={formData.receiveDate}
                    onChange={(e) => setFormData({...formData, receiveDate: e.target.value})}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Packaging Date"
                    type="date"
                    value={formData.packagingDate}
                    onChange={(e) => setFormData({...formData, packagingDate: e.target.value})}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Product Formed"
                    value={formData.productFormed}
                    onChange={(e) => setFormData({...formData, productFormed: e.target.value})}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Plant Location"
                    value={formData.plantLocation}
                    onChange={(e) => setFormData({...formData, plantLocation: e.target.value})}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    margin="normal"
                    multiline
                    rows={3}
                  />
                </Grid>
                {editingId && (
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
                        value={generateQRCode({
                          ...formData,
                          id: editingId || ''
                        })} 
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                      <Typography variant="caption" align="center" sx={{ mt: 2, wordBreak: 'break-all' }}>
                        Batch: {formData.batchNumber}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog} color="inherit">
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="contained" 
                color="primary"
              >
                {editingId ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Container>
    </Box>
  );
};

export default ManufacturerDashboard;
