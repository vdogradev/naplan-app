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
    logger.info(`🔍 Connected to: ${mongoose.connection.host}`);
    
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      logger.error(`❌ User "${username}" not found.`);
      process.exit(1);
    }

    logger.info(`👤 Found user: ${user.username} (Current role: ${user.role})`);
    
    user.role = role as any;
    await user.save();

    // Verify
    const freshUser = await User.findById(user._id);
    logger.info(`✅ Successfully promoted "${username}" to "${freshUser?.role}"!`);
    process.exit(0);
  } catch (error) {
    logger.error('❌ Promotion failed:', error);
    process.exit(1);
  }
};

promoteUser();
