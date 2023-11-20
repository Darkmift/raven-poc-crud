import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

export const joiValidateMiddleware = (
    schema: Joi.ObjectSchema,
    bodyType: 'body' | 'query',
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req[bodyType])
            return res
                .status(400)
                .send({ error: 'error parsing request payload: ' + bodyType });
        const { error } = schema.validate(req[bodyType], {
            abortEarly: false,
        });
        if (error) {
            const { details } = error;
            const mappedDetails = details.reduce(
                (
                    acc: { [key: string]: string },
                    i: Joi.ValidationErrorItem,
                ) => {
                    acc[i.path[0]] = i.message;
                    return acc;
                },
                {},
            );
            console.log(
                '🚀 ~ file: joi.ts:29 ~ return ~ mappedDetails:',
                mappedDetails,
            );
            logger.error('JOI error', { mappedDetails, bodyType });
            return res.status(400).send({ validationErrors: mappedDetails });
        }
        next();
    };
};
