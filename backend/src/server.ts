import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/database'
import { ENV } from './config/env'
import { logger } from './services/logger.service'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware'
import { userRoutes } from './api/user/user.routes'
import { authRoutes } from './api/auth/auth.routes'
import { medicalFieldRoutes } from './api/medicalField/medicalField.routes'
import { doctorRoutes } from './api/doctor/doctor.routs'
import { appointmentRoutes } from './api/appointment/appointment.routes'
import { errorHandler } from './middlewares/error.middleware'

const app = express()

const corsOptions: cors.CorsOptions = {
  origin: [
    'http://localhost:5173', // local
    'https://sheba-connect.vercel.app' // production
  ],
  credentials: true, 
}

// secure cookies can be set/recognized in render
app.set('trust proxy', 1) 

// middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(setupAsyncLocalStorage)

// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/medical-field', medicalFieldRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/appointment', appointmentRoutes)

// error habdler
app.use(errorHandler)



// start server after DB connects
connectDB()
  .then(() => {
    app.listen(ENV.PORT, () => {
      logger.info(`Server started on port ${ENV.PORT}`)
    })
  })
  .catch((err) => {
    logger.error(`Database connection error: ${err.message}`)
    process.exit(1)
  })