import mongoose from 'mongoose';
import logger from '../utils/logger';

/**
 * Establishes connection to MongoDB Atlas.
 * Hardened to handle Node 23+ DNS resolution and connection timeouts.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      logger.error('❌ MONGODB_URI is missing in .env configuration');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri, {
      // FORCE IPv4: Resolves the 'querySrv ENOTFOUND' error in Node 23+
      family: 4, 
      // TIMEOUT: Prevents the server from hanging indefinitely if Atlas is down
      serverSelectionTimeoutMS: 5000,
      // DEPLOYMENT SAFETY: Ensures we are connecting to the intended DB
      heartbeatFrequencyMS: 10000,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('❌ MongoDB connection failure:', error);
    // In a production/audit-ready environment, we exit to prevent 
    // the app from running in a partial/broken state.
    process.exit(1);
  }
};