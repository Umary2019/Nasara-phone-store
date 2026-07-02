import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDatabase } from './src/config/db.js';
import { createApp } from './src/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const port = process.env.PORT || 5000;
const app = createApp();

await connectDatabase(process.env.MONGO_URI);

app.listen(port, () => {
  console.log(`Nasara backend running on port ${port}`);
});
