import express, { Request, response, Response } from 'express';
const axios = require('axios');

// Get weather from zipcode
export const getWeather = async (req: Request, res: Response) => {
    // Get zipcode
    const zipcode: string = req.query.zipcode as string

    // Convert zipcode to longitude, latitude
    console.log(`API_KEY=${process.env.API_KEY}`)
    const url: string = 'https://maps.googleapis.com/maps/api/geocode/json'
    
    try {
        const mapResponse = await axios.get(url, {
            params: {
                address: zipcode,
                region: 'us',
                key: process.env.API_KEY,

            }
        })
        
        if (mapResponse.status === 200) {
            console.log(mapResponse)

            if (mapResponse.data.status === "OK"){
                const location = mapResponse.data.results[0].geometry.location

                var latitude = location.lat
                var longitude = location.lng
            }
            else {
                // TODO: Google API error message
                return undefined
            }
            
        }
        else {
            // TODO: Google API error status code
            return undefined
        }
    }
    catch (error) {
        console.error('Error calling Map API:', error);
    }

    res.json({ json: {
        latitude: latitude,
        longitude: longitude,
    } })
};
