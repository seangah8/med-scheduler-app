import express from 'express'
import cors from 'cors'
import { connectDB } from './config/database'
import { ENV } from './config/env'
import { logger } from './services/logger.service'
import { userRoutes } from './api/user/user.routs'
import { authRoutes } from './api/auth/auth.routs'

const app = express()

const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, 
}

app.use(cors(corsOptions))
app.use(express.json())

//* Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)


// start server after DB connects
connectDB()
  .then(() => {
    app.listen(ENV.PORT, () => {
      logger.info(`server started on port ${ENV.PORT}`)
    })
  })
  .catch((err) => {
    logger.error({ err }, "database connection error")
    process.exit(1)
  })