"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Establishes connection to MongoDB Atlas.
 * Hardened to handle Node 23+ DNS resolution and connection timeouts.
 */
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            logger_1.default.error('❌ MONGODB_URI is missing in .env configuration');
            process.exit(1);
        }
        const conn = await mongoose_1.default.connect(mongoUri, {
            // FORCE IPv4: Resolves the 'querySrv ENOTFOUND' error in Node 23+
            family: 4,
            // TIMEOUT: Prevents the server from hanging indefinitely if Atlas is down
            serverSelectionTimeoutMS: 5000,
            // DEPLOYMENT SAFETY: Ensures we are connecting to the intended DB
            heartbeatFrequencyMS: 10000,
        });
        logger_1.default.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        logger_1.default.error('❌ MongoDB connection failure:', error);
        // In a production/audit-ready environment, we exit to prevent 
        // the app from running in a partial/broken state.
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=database.js.map