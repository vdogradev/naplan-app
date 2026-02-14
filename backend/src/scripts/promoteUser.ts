import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import { connectDB } from '../config/database';
import logger from '../utils/logger';

dotenv.config();

const promoteUser = async () => {
  const username = process.argv[2];
  const role = process.argv[3] || 'admin';

  if (!username) {
    console.error('❌ Please provide a username: npm run promote-user <username> [role]');
    process.exit(1);
  }

  try {
    await connectDB();
    
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      logger.error(`❌ User "${username}" not found.`);
      process.exit(1);
    }

    user.role = role as any;
    await user.save();

    logger.info(`✅ Successfully promoted "${username}" to "${role}"!`);
    process.exit(0);
  } catch (error) {
    logger.error('❌ Promotion failed:', error);
    process.exit(1);
  }
};

promoteUser();
