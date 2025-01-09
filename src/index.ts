import express, { Request, Response } from 'express';
import weather from './Routes/WeatherRouter'
const dotenv = require('dotenv').config()
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

// Enable CORS
app.use(cors())

// Routes
app.use('/', weather)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});
