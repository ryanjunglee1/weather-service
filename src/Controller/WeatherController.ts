import express, { Request, Response } from 'express';

export const getWeather = (req: Request, res: Response) => {
    res.json({ message: "Test" });
};