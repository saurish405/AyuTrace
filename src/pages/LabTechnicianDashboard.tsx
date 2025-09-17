import React, { useState } from 'react';
import { 
  Box, Typography, Container, Paper, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Grid, MenuItem, FormControl, InputLabel, Select, Snackbar, Alert,
  Chip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface LabTestResult {
  id: string;
  batchNumber: string;
  herbName: string;
  scientificName: string;
  receiveDate: string;
  testDate: string;
  pesticideLevel: number;
  qualityGrade: 'A' | 'B' | 'C';
  notes: string;
}

const LabTechnicianDashboard = () => {
  const [testResults, setTestResults] = useState<LabTestResult[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Omit<LabTestResult, 'id'>>({
    batchNumber: '',
    herbName: '',
    scientificName: '',
    receiveDate: new Date().toISOString().split('T')[0],
    testDate: new Date().toISOString().split('T')[0],
    pesticideLevel: 0,
    qualityGrade: 'A',
    notes: ''
  });

  const handleOpenDialog = (result?: LabTestResult) => {
    if (result) {
      setEditingId(result.id);
      setFormData({
        batchNumber: result.batchNumber,
        herbName: result.herbName,
        scientificName: result.scientificName,
        receiveDate: result.receiveDate,
        testDate: result.testDate,
        pesticideLevel: result.pesticideLevel,
        qualityGrade: result.qualityGrade,
        notes: result.notes
      });
    } else {
      setEditingId(null);
      setFormData({
        batchNumber: '',
        herbName: '',
        scientificName: '',
        receiveDate: new Date().toISOString().split('T')[0],
        testDate: new Date().toISOString().split('T')[0],
        pesticideLevel: 0,
        qualityGrade: 'A',
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
      setTestResults(testResults.map(item => 
        item.id === editingId ? { ...formData, id: editingId } : item
      ));
      setSnackbarMessage('Test result updated successfully');
    } else {
      // Add new
      const newResult = {
        ...formData,
        id: Date.now().toString()
      };
      setTestResults([...testResults, newResult]);
      setSnackbarMessage('Test result added successfully');
    }
    setOpenDialog(false);
    setOpenSnackbar(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this test result?')) {
      setTestResults(testResults.filter(item => item.id !== id));
      setSnackbarMessage('Test result deleted successfully');
      setOpenSnackbar(true);
    }
  };

  const handleDownload = (result: LabTestResult) => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result, null, 2))}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `test-result-${result.batchNumber}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredResults = testResults.filter(result => 
    result.herbName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth={false}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Lab Test Results
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
              Import Result
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
                  <TableCell>Scientific Name</TableCell>
                  <TableCell>Test Date</TableCell>
                  <TableCell>Pesticide Level (ppm)</TableCell>
                  <TableCell>Quality Grade</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <TableRow key={result.id} hover>
                      <TableCell>{result.batchNumber}</TableCell>
                      <TableCell>{result.herbName}</TableCell>
                      <TableCell>{result.scientificName}</TableCell>
                      <TableCell>{new Date(result.testDate).toLocaleDateString()}</TableCell>
                      <TableCell>{result.pesticideLevel} ppm</TableCell>
                      <TableCell>
                        <Chip 
                          label={`Grade ${result.qualityGrade}`} 
                          color={
                            result.qualityGrade === 'A' ? 'success' : 
                            result.qualityGrade === 'B' ? 'primary' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleOpenDialog(result)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleDownload(result)}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDelete(result.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">
                        {searchTerm ? 'No matching results found' : 'No test results available'}
                      </Typography>
                      {!searchTerm && (
                        <Button 
                          variant="outlined" 
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenDialog()}
                          sx={{ mt: 2 }}
                        >
                          Add Test Result
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Add/Edit Test Result Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? 'Edit Test Result' : 'Import Test Result'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Batch Number"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Herb Name"
                  value={formData.herbName}
                  onChange={(e) => setFormData({...formData, herbName: e.target.value})}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Scientific Name"
                  value={formData.scientificName}
                  onChange={(e) => setFormData({...formData, scientificName: e.target.value})}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Test Date"
                  type="date"
                  value={formData.testDate}
                  onChange={(e) => setFormData({...formData, testDate: e.target.value})}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pesticide Level (ppm)"
                  type="number"
                  value={formData.pesticideLevel}
                  onChange={(e) => setFormData({...formData, pesticideLevel: parseFloat(e.target.value) || 0})}
                  margin="normal"
                  inputProps={{ step: '0.01', min: '0' }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Quality Grade</InputLabel>
                  <Select
                    value={formData.qualityGrade}
                    label="Quality Grade"
                    onChange={(e) => setFormData({...formData, qualityGrade: e.target.value as 'A' | 'B' | 'C'})}
                  >
                    <MenuItem value="A">Grade A - Excellent</MenuItem>
                    <MenuItem value="B">Grade B - Good</MenuItem>
                    <MenuItem value="C">Grade C - Average</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  margin="normal"
                  placeholder="Enter any additional notes..."
                />
              </Grid>
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
              disabled={!formData.batchNumber || !formData.herbName || !formData.scientificName}
            >
              {editingId ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LabTechnicianDashboard;
