"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("../utils/logger"));
let redis = null;
const connectRedis = async () => {
    try {
        redis = new ioredis_1.default({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });
        redis.on('connect', () => {
            logger_1.default.info('✅ Redis Connected');
        });
        redis.on('error', (err) => {
            logger_1.default.error('❌ Redis error:', err);
        });
    }
    catch (error) {
        logger_1.default.error('❌ Redis connection error:', error);
        // Don't exit - app can work without Redis
    }
};
const getRedis = () => redis;
exports.getRedis = getRedis;
exports.default = connectRedis;
//# sourceMappingURL=redis.js.map