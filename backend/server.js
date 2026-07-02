import dotenv from 'dotenv';
import { connectDatabase } from './src/config/db.js';
import { createApp } from './src/app.js';

dotenv.config();

const port = process.env.PORT || 5000;
const app = createApp();

await connectDatabase(process.env.MONGO_URI);

app.listen(port, () => {
  console.log(`Nasara backend running on port ${port}`);
});
