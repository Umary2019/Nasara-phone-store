import dotenv from 'dotenv';
import { createApp } from '../src/app.js';
import { connectDatabase } from '../src/config/db.js';

dotenv.config();

const globalCache = globalThis;

async function initApp() {
  if (!globalCache.__nasaraApp) {
    globalCache.__nasaraApp = createApp();
  }

  if (!globalCache.__nasaraDbPromise) {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is required');
    }
    globalCache.__nasaraDbPromise = connectDatabase(process.env.MONGO_URI);
  }

  await globalCache.__nasaraDbPromise;
  return globalCache.__nasaraApp;
}

export default async function handler(req, res) {
  const app = await initApp();
  return app(req, res);
}
