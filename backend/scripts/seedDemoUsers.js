import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const demoUsers = [
  {
    name: 'Demo Student',
    email: 'student@campus.test',
    password: 'Student@123',
    role: 'student',
    enrollmentNumber: 'DEMO-STUDENT-001',
    department: 'Computer Applications',
    semester: 1
  },
  {
    name: 'Demo Organizer',
    email: 'organizer@campus.test',
    password: 'Organizer@123',
    role: 'organizer',
    department: 'Computer Applications',
    semester: 6,
    canCreateEvents: true,
    canManageRegistrations: true
  },
  {
    name: 'Demo Admin',
    email: 'admin@campus.test',
    password: 'Admin@123',
    role: 'admin',
    canCreateEvents: true,
    canManageRegistrations: true
  }
];

const seedDemoUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const demoUser of demoUsers) {
      const { email, ...userData } = demoUser;
      const existingUser = await User.findOne({ email }).select('+password');

      if (existingUser) {
        Object.assign(existingUser, userData);
        await existingUser.save();
      } else {
        await User.create({ email, ...userData });
      }

      console.log(`Demo user ready: ${email}`);
    }
  } catch (error) {
    console.error(`Unable to seed demo users: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDemoUsers();
