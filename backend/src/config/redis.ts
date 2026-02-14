import Redis from 'ioredis';
import logger from '../utils/logger';

let redis: Redis | null = null;

const connectRedis = async (): Promise<void> => {
  try {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });

    redis.on('connect', () => {
      logger.info('✅ Redis Connected');
    });

    redis.on('error', (err) => {
      logger.error('❌ Redis error:', err);
    });

  } catch (error) {
    logger.error('❌ Redis connection error:', error);
    // Don't exit - app can work without Redis
  }
};

export const getRedis = (): Redis | null => redis;

export default connectRedis;