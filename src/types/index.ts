/**
 * Represents a batch entry in the system
 */
export interface BatchEntry {
  /** Unique identifier for the batch */
  id: string;
  
  /** Batch number/identifier (e.g., 'BATCH-2023-001') */
  batchNumber: string;
  
  /** Common name of the herb */
  herbName: string;
  
  /** Scientific/Latin name of the herb */
  scientificName: string;
  
  /** Date when the batch was received (ISO 8601 format) */
  dateReceived: string;
  
  /** Weight of the batch when received (in kg) */
  weightReceived: number;
  
  /** Weight of the batch after processing (in kg) */
  weightAfterProcessing: number;
  
  /** Timestamp when the batch was created (ISO 8601 format) */
  createdAt: string;
  
  /** Timestamp when the batch was last updated (ISO 8601 format) */
  updatedAt: string;
}

/**
 * Represents the structure of the data stored in localStorage
 */
export interface BatchStorage {
  /** Array of batch entries */
  batches: BatchEntry[];
}

/**
 * Type for creating a new batch (omits auto-generated fields)
 */
export type NewBatchEntry = Omit<BatchEntry, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Type for updating an existing batch
 */
export type UpdateBatchEntry = Partial<Omit<BatchEntry, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: string;
  updatedAt: string;
};
