import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import { BatchEntry } from '../types';

interface AddBatchFormProps {
  open: boolean;
  batch?: BatchEntry;
  onClose: () => void;
  onSave: (batch: Omit<BatchEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const AddBatchForm: React.FC<AddBatchFormProps> = ({ open, batch, onClose, onSave }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    batchNumber: batch?.batchNumber || '',
    herbName: batch?.herbName || '',
    scientificName: batch?.scientificName || '',
    dateReceived: batch?.dateReceived || new Date().toISOString().split('T')[0],
    weightReceived: batch?.weightReceived.toString() || '',
    weightAfterProcessing: batch?.weightAfterProcessing.toString() || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFormData({
        batchNumber: batch?.batchNumber || '',
        herbName: batch?.herbName || '',
        scientificName: batch?.scientificName || '',
        dateReceived: batch?.dateReceived || new Date().toISOString().split('T')[0],
        weightReceived: batch?.weightReceived.toString() || '',
        weightAfterProcessing: batch?.weightAfterProcessing.toString() || '',
      });
      setErrors({});
    }
  }, [open, batch]);

  const handleClose = () => {
    setFormData({
      batchNumber: '',
      herbName: '',
      scientificName: '',
      dateReceived: new Date().toISOString().split('T')[0],
      weightReceived: '',
      weightAfterProcessing: '',
    });
    setErrors({});
    onClose();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.batchNumber) newErrors.batchNumber = 'Batch number is required';
    if (!formData.herbName) newErrors.herbName = 'Herb name is required';
    if (!formData.scientificName) newErrors.scientificName = 'Scientific name is required';
    if (!formData.dateReceived) newErrors.dateReceived = 'Date received is required';
    if (!formData.weightReceived) newErrors.weightReceived = 'Weight received is required';
    if (!formData.weightAfterProcessing) newErrors.weightAfterProcessing = 'Weight after processing is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newBatch = {
      ...formData,
      weightReceived: parseFloat(formData.weightReceived),
      weightAfterProcessing: parseFloat(formData.weightAfterProcessing),
    };

    onSave(newBatch);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
      }}>
        <Typography variant="h6">{batch ? 'Edit Batch' : 'Add New Batch'}</Typography>
        <IconButton onClick={handleClose} sx={{ color: 'inherit' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <TextField
              name="batchNumber"
              label="Batch Number"
              value={formData.batchNumber}
              onChange={handleChange}
              fullWidth
              error={!!errors.batchNumber}
              helperText={errors.batchNumber}
              variant="outlined"
              size="small"
            />
            <TextField
              name="herbName"
              label="Herb Name"
              value={formData.herbName}
              onChange={handleChange}
              fullWidth
              error={!!errors.herbName}
              helperText={errors.herbName}
              variant="outlined"
              size="small"
            />
            <TextField
              name="scientificName"
              label="Scientific Name"
              value={formData.scientificName}
              onChange={handleChange}
              fullWidth
              error={!!errors.scientificName}
              helperText={errors.scientificName}
              variant="outlined"
              size="small"
            />
            <TextField
              name="dateReceived"
              label="Date Received"
              type="date"
              value={formData.dateReceived}
              onChange={handleChange}
              fullWidth
              error={!!errors.dateReceived}
              helperText={errors.dateReceived}
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="weightReceived"
              label="Weight Received (kg)"
              type="number"
              value={formData.weightReceived}
              onChange={handleChange}
              fullWidth
              error={!!errors.weightReceived}
              helperText={errors.weightReceived}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />
            <TextField
              name="weightAfterProcessing"
              label="Weight After Processing (kg)"
              type="number"
              value={formData.weightAfterProcessing}
              onChange={handleChange}
              fullWidth
              error={!!errors.weightAfterProcessing}
              helperText={errors.weightAfterProcessing}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Save Entry
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
