import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Role } from '../models/Role.js';
import { User } from '../models/User.js';

dotenv.config();

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nasara_phone_store';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  const roles = ['admin', 'cashier'];
  for (const name of roles) {
    await Role.findOneAndUpdate({ name }, { name, permissions: [] }, { upsert: true, new: true });
    console.log('Ensured role:', name);
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@nasara.local';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const adminRole = await Role.findOne({ name: 'admin' });
    const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@1234';
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ fullName: 'Nasara Admin', email: adminEmail, phoneNumber: '', passwordHash, role: adminRole._id, roleName: 'admin' });
    console.log('Created admin user:', user.email, 'password:', password);
  } else {
    console.log('Admin user already exists:', adminEmail);
  }

  await mongoose.disconnect();
  console.log('Seed complete');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
