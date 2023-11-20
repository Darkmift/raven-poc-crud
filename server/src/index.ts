import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

import { LOG_FORMAT, PORT } from '@/config';
import { logger, stream } from '@/utils/logger';
import swaggerUiUtil from '@/utils/swagger';
import mainRouter from './main.router';
import errorHandler from './api/common/middlwares/error-handler';

const app: Express = express();
const port = PORT || 5000;

app.use(express.json());

app.use(morgan(LOG_FORMAT, { stream }));

// add uuid to each request
// log it
app.all('*', (req, _, next: NextFunction) => {
    req.uuid = uuidv4();
    const { method, body, query, params, path } = req;
    logger.info(`req: ${req.uuid}`, {
        method,
        body,
        query,
        params,
        path,
    });
    next();
});

// health
app.get('/health', async (req: Request, res: Response) => {
    const data: any = {
        uuid: req.uuid,
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date(),
        sqlConnection: null,
    };

    res.status(200).send(data);
});

// swagger
app.use('/api-docs', swaggerUiUtil.serve, swaggerUiUtil.setup);

app.use('/api', mainRouter);

// Always last (global error handler)
app.use(errorHandler);

export default app;
