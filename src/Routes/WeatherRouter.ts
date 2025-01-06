import { Router } from 'express';
import { getWeather } from '../Controller/WeatherController';

const router = Router();

router.get('/weather', getWeather);

export default router;
