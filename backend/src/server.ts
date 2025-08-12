import express from 'express'
import cors from 'cors'
import { connectDB } from './config/database'
import { ENV } from './config/env'
import { logger } from './services/logger.service';


const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// test route
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok' })
})


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