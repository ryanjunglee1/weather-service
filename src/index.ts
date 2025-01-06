import express, { Request, Response } from 'express';
import weather from './Routes/WeatherRouter'
const dotenv = require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3000;

// Routes
app.use('/', weather);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
