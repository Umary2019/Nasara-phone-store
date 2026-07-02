import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGO_URI;
console.log('Testing connection to:', uri.replace(/:.+@/, ':***@'));

const client = new MongoClient(uri, {
  retryWrites: true,
  w: 'majority'
});

try {
  await client.connect();
  console.log('✅ Successfully connected to MongoDB Atlas!');
  
  const adminDb = client.db('admin');
  const result = await adminDb.command({ ping: 1 });
  console.log('✅ Ping successful:', result);
  
  await client.close();
  process.exit(0);
} catch (error) {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
}
