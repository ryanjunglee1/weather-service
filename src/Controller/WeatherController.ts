import express, { Request, response, Response } from 'express'
const axios = require('axios')

/*
 GET /weather
 */
export const getWeather = async (req: Request, res: Response) => {
    const units: string = 'fahrenheit'
    const timezone: string = 'EST'

    // Get zipcode
    const zipcode: string = req.query.zipcode as string
    if (zipcode === undefined) {
        res.status(400)
        res.json({
            error: 'Empty zip code parameter value.'
        })
        console.error('Error: empty zip code parameter value.')
        return undefined
    }

    // Convert zipcode to longitude, latitude
    const url: string = 'https://maps.googleapis.com/maps/api/geocode/json'
    
    try {
        if (Number.isNaN(zipcode) || zipcode.length !== 5) {
            // Bad zipcode
            res.status(400)
            res.json({
                error: 'Invalid zip code.'
            })
            console.error('Error: Invalid zip code.')
            return undefined
        }
        const mapResponse = await axios.get(url, {
            params: {
                address: zipcode,
                region: 'us',
                key: process.env.API_KEY,

            }
        })
        
        if (mapResponse.status === 200) {
            if (mapResponse.data.status === "OK"){
                // Get latitude and longitude
                const location = mapResponse.data.results[0].geometry.location

                var latitude = location.lat
                var longitude = location.lng
            }
            else if (mapResponse.data.status === 'ZERO_RESULTS') {
                // Google API error message
                res.status(404)
                res.json({
                    error: 'Unable to Find Zip Code.'
                })
                console.error('Error calling Map API: ', 'Unable to Find Zip Code.')
                return undefined
            }
            else {
                // Google API error message
                res.status(404)
                res.json({
                    error: mapResponse.data.status
                })
                console.error('Error calling Map API: ', mapResponse.data.status)
                return undefined
            }
            
        }
        else {
            // Google API error status code
            console.log("Log 2")
            res.status(404)
            res.json({
                error: mapResponse.data.error_message
            })
            console.error('Error calling Map API: ', mapResponse.data.error_message)
            return undefined
        }
    }
    catch (error: any) {
        res.status(error.status)
        console.log("Log 3")
        res.json({
            error: error.response?.data?.reason
        })
        console.error('Error calling Map API: ', error.response?.data?.reason)
        return undefined
    }

    // Get weather
    const weatherUrl: string = `https://api.open-meteo.com/v1/forecast?temperature_unit=${units}&timezone=${timezone}&latitude=${latitude}&longitude=${longitude}&current=temperature_2m`

    try {
        const weatherRes = await axios.get(weatherUrl)

        // Catch unsupported format
        if (weatherRes.error === true) {
            res.status(404)
            res.json({
                error: weatherRes.data.reason
            })
            console.error('Error calling Weather API: ', weatherRes.data.error_message)
            return undefined
        }

        var temperature = weatherRes.data.current?.temperature_2m
        console.log(temperature)

        if (temperature === '') {
            res.status(404)
            res.json({
                error:  'No Temperature Data Found.'
            })
            console.error('Error calling Weather API: ', 'No Temperature Data Found.')
            return undefined
        }
    }
    catch (error: any) {
        // TODO: Catch error
        res.status(404)
        res.json({
            error: error.response?.data?.reason
        })
        console.error('Error calling Weather API: ', error.response?.data?.reason)
        return undefined
    }

    res.json({ 
        temperature: temperature,
        units: units === 'fahrenheit' ? 'F' : 'C',
    } )
} 
