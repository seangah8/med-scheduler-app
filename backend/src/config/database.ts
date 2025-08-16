import mongoose from 'mongoose'
import { ENV } from './env'
import { logger } from '../services/logger.service'

// connect to MongoDB
export async function connectDB() {

  // try to connect using uri from .env
  try {
    await mongoose.connect(ENV.MONGODB_URI)
    logger.info('mongodb connected')

  // log error and exit app if connection fails
  } catch (error : any) {
    logger.error(`mongodb connection error: ${error.message}`)
    
    process.exit(1)
  }
}
