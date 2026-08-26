import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const PORT = process.env.PORT || 4002
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const isDbConnected = await connectDB()

if (!isDbConnected) {
  console.warn('MongoDB is not connected. The app will continue running, but database features will be unavailable.')
}

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)

app.get('/', (req, res) => res.send("API Working..."))

const server = app.listen(PORT, () => console.log('Server running on port ' + PORT))

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the existing server or change PORT in your environment.`)
  } else {
    console.error('Server error:', error.message)
  }

  process.exit(1)
})