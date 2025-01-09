import express, { Request, response, Response } from 'express'
import { getWeather } from './WeatherController'
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios
jest.mock('axios');

describe('GET /weather', () => {
    it ('Success', async () => {
        // Params
        const request = {
            query: {
                zipcode: '22030'
            }
        } as any

        const response = {
            status: jest.fn(),
            json: jest.fn(),
        } as any

        // Mock
        // mapResponse.data.results[0].geometry.location
        // Mock for Google API call
        mockedAxios.get.mockResolvedValueOnce({ 
            data: {
                results: [{
                    geometry: {
                        location: {
                            latitude: 38.8454,
                            longitude: 77.3210,
                        } 
                    }  
                }],
                status: 'OK',
            },
            status: 200,
        });
        // Mock for Weather API call
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                current: {
                    temperature_2m: '30',
                    units: 'F',
                } 
            },
            error: false,
        });

        // Exec
        await getWeather(request, response)

        // Validate
        expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
            temperature: expect.any(String), // Check if property exists
          }))
        expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
            units: expect.any(String), // This checks if 'message' is a string
          }))
    })

    it('Should fail with invalid zip code', async () => {
        // Params
        const request = {
            query: {
                zipcode: '123'
            }
        } as any

        const response = {
            json: jest.fn(),
            status: jest.fn(),
        } as any
        
        // Expected
        const expected_result = {
            error: 'Invalid zip code.'
        }
        const expected_status = 400

        // Exec
        await getWeather(request, response)
        
        // Validate
        expect(response.status).toHaveBeenCalledWith(expected_status)
        expect(response.json).toHaveBeenCalledWith(expected_result)
    })

    it('Should fail with empty zipcode parameter', async () => {
        // Params
        const request = {
            query: {},
        } as any

        const response = {
            json: jest.fn(),
            status: jest.fn(),
        } as any
        
        // Expected
        const expected_result = {
            error: 'Empty zip code parameter value.'
        }
        const expected_status = 400

        // Exec
        await getWeather(request, response)
        
        // Validate
        expect(response.status).toHaveBeenCalledWith(expected_status)
        expect(response.json).toHaveBeenCalledWith(expected_result)
    })
}

)
