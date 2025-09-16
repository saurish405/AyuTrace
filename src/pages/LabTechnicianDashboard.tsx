import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Container, Paper, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  InputAdornment, Divider, Card, CardContent, Grid
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  FileUpload as FileUploadIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Science as ScienceIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

interface TestBatch {
  id: string;
  batchNumber: string;
  herbName: string;
  source: string;
  receivedDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  testResults?: {
    certificateNumber: string;
    qualityGrade: 'A' | 'B' | 'C';
    pesticideLevel: number;
    testDate: string;
    notes: string;
  };
}

export const LabTechnicianDashboard = () => {
  const [batches, setBatches] = useState<TestBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<TestBatch | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [testResults, setTestResults] = useState({
    certificateNumber: '',
    qualityGrade: 'A' as 'A' | 'B' | 'C',
    pesticideLevel: 0,
    testDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const navigate = useNavigate();

  // Mock data
  useEffect(() => {
    const mockBatches: TestBatch[] = [
      {
        id: '1',
        batchNumber: 'BATCH-2023-101',
        herbName: 'Ashwagandha',
        source: 'Farm: Green Valley Herbs',
        receivedDate: '2023-09-15',
        status: 'pending'
      },
      {
        id: '2',
        batchNumber: 'BATCH-2023-102',
        herbName: 'Turmeric',
        source: 'Farm: Golden Roots',
        receivedDate: '2023-09-16',
        status: 'in-progress',
        testResults: {
          certificateNumber: 'CERT-001',
          qualityGrade: 'A',
          pesticideLevel: 0.02,
          testDate: '2023-09-16',
          notes: 'Good quality, within safe limits'
        }
      },
    ];
    setBatches(mockBatches);
  }, []);

  const handleOpenDialog = (batch: TestBatch) => {
    setSelectedBatch(batch);
    if (batch.testResults) {
      setTestResults(batch.testResults);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBatch(null);
    setTestResults({
      certificateNumber: '',
      qualityGrade: 'A',
      pesticideLevel: 0,
      testDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleSubmitTestResults = () => {
    if (!selectedBatch) return;
    
    const updatedBatches = batches.map(batch => {
      if (batch.id === selectedBatch.id) {
        return {
          ...batch,
          status: 'completed' as const,
          testResults: { ...testResults }
        };
      }
      return batch;
    });
    
    setBatches(updatedBatches);
    handleCloseDialog();
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" />;
      case 'in-progress':
        return <Chip icon={<ScienceIcon />} label="In Progress" color="info" />;
      case 'completed':
        return <Chip icon={<CheckCircleIcon />} label="Completed" color="success" />;
      default:
        return <Chip label={status} />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth={false}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Lab Technician Dashboard
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
                  <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Pending Tests
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {batches.filter(b => b.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Waiting for testing
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScienceIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    In Progress
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {batches.filter(b => b.status === 'in-progress').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Currently testing
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Tests Completed
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {batches.filter(b => b.status === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ready for packaging
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2">
              Test Batches
            </Typography>
            <Button variant="contained" startIcon={<FileUploadIcon />}>
              Import Results
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Batch #</TableCell>
                  <TableCell>Herb Name</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Received Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id} hover>
                    <TableCell>{batch.batchNumber}</TableCell>
                    <TableCell>{batch.herbName}</TableCell>
                    <TableCell>{batch.source}</TableCell>
                    <TableCell>{new Date(batch.receivedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusChip(batch.status)}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant={batch.status === 'completed' ? 'outlined' : 'contained'}
                        size="small"
                        onClick={() => handleOpenDialog(batch)}
                      >
                        {batch.status === 'completed' ? 'View Results' : 'Enter Results'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Test Results Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedBatch?.testResults ? 'Test Results' : 'Enter Test Results'}
          <Typography variant="subtitle2" color="text.secondary">
            {selectedBatch?.batchNumber} - {selectedBatch?.herbName}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Certificate Number"
                value={testResults.certificateNumber}
                onChange={(e) => setTestResults({...testResults, certificateNumber: e.target.value})}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Quality Grade</InputLabel>
                <Select
                  value={testResults.qualityGrade}
                  label="Quality Grade"
                  onChange={(e) => setTestResults({...testResults, qualityGrade: e.target.value as 'A' | 'B' | 'C'})}
                >
                  <MenuItem value="A">Grade A - Excellent</MenuItem>
                  <MenuItem value="B">Grade B - Good</MenuItem>
                  <MenuItem value="C">Grade C - Average</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Pesticide Level (ppm)"
                type="number"
                value={testResults.pesticideLevel}
                onChange={(e) => setTestResults({...testResults, pesticideLevel: parseFloat(e.target.value) || 0})}
                margin="normal"
                inputProps={{ step: '0.01' }}
                required
              />
              <TextField
                fullWidth
                label="Test Date"
                type="date"
                value={testResults.testDate}
                onChange={(e) => setTestResults({...testResults, testDate: e.target.value})}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                value={testResults.notes}
                onChange={(e) => setTestResults({...testResults, notes: e.target.value})}
                margin="normal"
                placeholder="Enter any additional notes or observations..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitTestResults} 
            variant="contained" 
            color="primary"
            disabled={!testResults.certificateNumber}
          >
            {selectedBatch?.testResults ? 'Update Results' : 'Submit Results'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LabTechnicianDashboard;
