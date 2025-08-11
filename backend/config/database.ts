import mongoose from 'mongoose'
import { ENV } from './env'

// connect to MongoDB
export async function connectDB() {

  // try to connect using uri from .env
  try {
    await mongoose.connect(ENV.MONGODB_URI)
    console.log('mongodb connected')

  // log error and exit app if connection fails
  } catch (error) {
    console.error('mongodb connection error:', error)
    process.exit(1)
  }
}
