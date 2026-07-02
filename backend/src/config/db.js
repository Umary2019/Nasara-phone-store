import mongoose from 'mongoose';

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error('MONGO_URI environment variable is required');
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
