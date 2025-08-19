import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/database'
import { ENV } from './config/env'
import { logger } from './services/logger.service'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware'
import { userRoutes } from './api/user/user.routs'
import { authRoutes } from './api/auth/auth.routs'
import { medicalFieldRoutes } from './api/medicalField/medicalField.routs'
import { doctorRoutes } from './api/doctor/doctor.routs'
import { appointmentRoutes } from './api/appointment/appointment.routs'



const app = express()

const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, 
}

// middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(setupAsyncLocalStorage)

//* Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/medical-field', medicalFieldRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/appointment', appointmentRoutes)


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