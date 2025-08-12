import express from 'express'
import cors from 'cors'
import { connectDB } from './config/database'
import { ENV } from './config/env'

const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// test route
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok' })
})

// start server after DB connects
connectDB().then(() => {
  app.listen(ENV.PORT, () => {
    console.log(`server running on http://localhost:${ENV.PORT}`)
  })
})