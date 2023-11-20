import { NextFunction, Request, Response } from 'express';
import { getById, getAll } from './services';

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await getById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await getAll();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
