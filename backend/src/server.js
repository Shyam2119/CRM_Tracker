import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';
import { logger } from './utils/logger.js';

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});
