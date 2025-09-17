import { v4 as uuidv4 } from 'uuid';
import { BatchEntry, BatchStorage, NewBatchEntry } from '../types';

const STORAGE_KEY = 'ayurvedic_herb_batches';

// Initialize storage if it doesn't exist
const initializeStorage = (): BatchStorage => {
  const initialData: BatchStorage = { batches: [] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

export const getBatches = (): BatchEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const initialData = initializeStorage();
      return initialData.batches;
    }
    
    const parsedData: unknown = JSON.parse(data);
    
    // Type guard to validate the structure
    if (parsedData && typeof parsedData === 'object' && 'batches' in parsedData) {
      const storageData = parsedData as BatchStorage;
      return storageData.batches.map(batch => ({
        ...batch,
        weightReceived: Number(batch.weightReceived) || 0,
        weightAfterProcessing: Number(batch.weightAfterProcessing) || 0,
        // Ensure dates are valid
        createdAt: batch.createdAt || new Date().toISOString(),
        updatedAt: batch.updatedAt || new Date().toISOString(),
      }));
    }
    
    console.warn('Invalid data structure in localStorage, initializing with empty array');
    return [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const addBatch = (batch: NewBatchEntry): BatchEntry => {
  try {
    // Validate required fields
    if (!batch.batchNumber || !batch.herbName || !batch.scientificName || !batch.dateReceived) {
      throw new Error('Missing required batch fields');
    }

    // Ensure numeric values
    const validatedBatch = {
      ...batch,
      weightReceived: Number(batch.weightReceived) || 0,
      weightAfterProcessing: Number(batch.weightAfterProcessing) || 0,
    };

    const newBatch: BatchEntry = {
      ...validatedBatch,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const batches = getBatches();
    const updatedBatches = [...batches, newBatch];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ batches: updatedBatches }));
    return newBatch;
  } catch (error) {
    console.error('Error adding batch to storage:', error);
    throw error; // Re-throw to allow handling in the component
  }
};

/**
 * Updates an existing batch in storage
 * @param batchId The ID of the batch to update
 * @param updates The fields to update
 * @returns The updated batch or null if not found
 */
export const updateBatch = (
  batchId: string, 
  updates: Partial<Omit<BatchEntry, 'id' | 'createdAt' | 'updatedAt'>>
): BatchEntry | null => {
  try {
    const batches = getBatches();
    const index = batches.findIndex(b => b.id === batchId);
    
    if (index === -1) {
      console.warn(`Batch with ID ${batchId} not found`);
      return null;
    }
    
    const updatedBatch: BatchEntry = {
      ...batches[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    const updatedBatches = [...batches];
    updatedBatches[index] = updatedBatch;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ batches: updatedBatches }));
    return updatedBatch;
  } catch (error) {
    console.error('Error updating batch:', error);
    throw error;
  }
};

/**
 * Downloads a batch as a JSON file
 * @param batch The batch to download
 */
/**
 * Deletes a batch from storage
 * @param batchId The ID of the batch to delete
 * @returns true if the batch was deleted, false otherwise
 */
export const deleteBatch = (batchId: string): boolean => {
  try {
    const batches = getBatches();
    const initialLength = batches.length;
    const updatedBatches = batches.filter(batch => batch.id !== batchId);
    
    if (updatedBatches.length === initialLength) {
      console.warn(`Batch with ID ${batchId} not found`);
      return false;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ batches: updatedBatches }));
    return true;
  } catch (error) {
    console.error('Error deleting batch:', error);
    throw error;
  }
};

/**
 * Downloads a batch as a JSON file
 * @param batch The batch to download
 */
export const downloadBatchAsJson = (batch: BatchEntry): void => {
  try {
    if (!batch || !batch.batchNumber) {
      throw new Error('Invalid batch data provided for download');
    }

    // Sanitize the batch number for the filename
    const sanitizedBatchNumber = batch.batchNumber
      .replace(/[^a-z0-9_-]/gi, '_')
      .toLowerCase();
    
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(batch, null, 2)
    )}`;
    
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `batch-${sanitizedBatchNumber}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  } catch (error) {
    console.error('Error downloading batch as JSON:', error);
    throw error; // Re-throw to allow handling in the component
  }
};
