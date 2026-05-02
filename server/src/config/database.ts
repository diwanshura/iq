import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iq-assessment';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠ MongoDB connection failed. Running in offline mode.');
    console.warn('Please ensure MongoDB is running on localhost:27017');
    console.warn('Error:', error instanceof Error ? error.message : 'Unknown error');
    // Don't exit, allow server to continue in offline mode for development
  }
};

export default mongoose;
