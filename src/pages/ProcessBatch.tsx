import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BatchEntry } from '../types';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Stack,
  Chip,
  Grid,
  Container,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

// Helper function to format dates
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
};

// Function to get batch details
const getBatchDetails = async (id: string): Promise<BatchEntry | null> => {
  // This will be replaced with an actual API call
  // For now, return null as we've removed the dummy data
  return null;
};

// Validation schema
const validationSchema = Yup.object({
  cleaningInfo: Yup.string().required('Cleaning information is required'),
  processedWeight: Yup.number()
    .required('Processed weight is required')
    .min(0.1, 'Weight must be greater than 0'),
  location: Yup.object({
    lat: Yup.number().required(),
    lng: Yup.number().required(),
    address: Yup.string().required('Location is required'),
  }),
  processingDate: Yup.string().required('Processing date is required'),
  notes: Yup.string(),
});

interface FormValues {
  cleaningInfo: string;
  processedWeight: string;
  processingDate: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  notes: string;
}

const ProcessBatch: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<BatchEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      cleaningInfo: '',
      processedWeight: '',
      processingDate: new Date().toISOString().split('T')[0],
      location: {
        lat: 0,
        lng: 0,
        address: '',
      },
      notes: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        console.log('Submitting batch processing details:', values);
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Batch processed successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error submitting batch processing:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        formik.setFieldValue('location', {
          ...formik.values.location,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: 'Current location (approximate)',
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location');
        setIsGettingLocation(false);
      }
    );
  }, [formik]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchBatch = async () => {
      if (!batchId) {
        setLoading(false);
        return;
      }

      try {
        const batchData = await getBatchDetails(batchId);
        setBatch(batchData);
      } catch (error) {
        console.error('Error fetching batch details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [batchId, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!batch) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" color="error">
          Batch not found.
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Back to Batches
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Batches
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        Process Batch: {batch.batchNumber || 'N/A'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4} component="div">
          <Card>
            <CardHeader title="Batch Details" />
            <CardContent>
              <Stack spacing={2}>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Herb Name
                  </Typography>
                  <Typography variant="body1">{batch.herbName || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Scientific Name
                  </Typography>
                  <Typography variant="body1">{batch.scientificName || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Date Received
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(batch.dateReceived)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Weight Received
                  </Typography>
                  <Typography variant="body1">
                    {`${batch.weightReceived} kg`}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Weight After Processing
                  </Typography>
                  <Typography variant="body1">{`${batch.weightAfterProcessing} kg`}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={batch.weightAfterProcessing > 0 ? 'PROCESSED' : 'PENDING'}
                    color={batch.weightAfterProcessing > 0 ? 'success' : 'warning'}
                    size="small"
                  />
                </div>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardHeader title="Sample Photo" />
            <CardContent>
              <Box
                sx={{
                  border: '1px dashed #ccc',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                  capture="environment"
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Batch sample"
                    style={{ maxWidth: '100%', maxHeight: 250, borderRadius: 4 }}
                  />
                ) : (
                  <>
                    <PhotoCameraIcon fontSize="large" color="action" />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Click to upload a photo
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      or drag and drop
                    </Typography>
                  </>
                )}
              </Box>
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                Take a photo of the processed sample
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8} component="div">
          <Card>
            <CardHeader title="Processing Details" />
            <CardContent>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="cleaningInfo"
                      name="cleaningInfo"
                      label="Cleaning & Grading Information"
                      multiline
                      rows={4}
                      value={formik.values.cleaningInfo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.cleaningInfo && Boolean(formik.errors.cleaningInfo)}
                      helperText={formik.touched.cleaningInfo && formik.errors.cleaningInfo}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="processedWeight"
                      name="processedWeight"
                      label="Weight After Processing (kg)"
                      type="number"
                      inputProps={{ step: '0.1', min: '0.1' }}
                      value={formik.values.processedWeight}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.processedWeight && Boolean(formik.errors.processedWeight)}
                      helperText={
                        formik.touched.processedWeight && formik.errors.processedWeight
                          ? formik.errors.processedWeight
                          : `Initial weight: ${batch.weightReceived} kg`
                      }
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="processingDate"
                      name="processingDate"
                      label="Processing Date"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formik.values.processingDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.processingDate && Boolean(formik.errors.processingDate)}
                      helperText={formik.touched.processingDate && formik.errors.processingDate}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Typography variant="subtitle2">Location</Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleGetLocation}
                        disabled={isGettingLocation}
                        startIcon={
                          isGettingLocation ? (
                            <CircularProgress size={16} />
                          ) : undefined
                        }
                      >
                        {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
                      </Button>
                    </Box>
                    <TextField
                      fullWidth
                      id="location.address"
                      name="location.address"
                      value={formik.values.location.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.location?.address &&
                        Boolean(formik.errors.location?.address)
                      }
                      helperText={
                        formik.touched.location?.address && formik.errors.location?.address
                      }
                      variant="outlined"
                      placeholder="Enter location or use current location"
                    />
                    <input
                      type="hidden"
                      name="location.lat"
                      value={formik.values.location.lat}
                    />
                    <input
                      type="hidden"
                      name="location.lng"
                      value={formik.values.location.lng}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="notes"
                      name="notes"
                      label="Additional Notes"
                      multiline
                      rows={3}
                      value={formik.values.notes}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting || !formik.isValid}
                        startIcon={
                          isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
                        }
                      >
                        {isSubmitting ? 'Processing...' : 'Save Processing Details'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProcessBatch;
