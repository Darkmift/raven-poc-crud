import request from 'supertest';
import app from '../src/index';
import { logger } from '@/utils/logger';
import { NODE_ENV, PORT } from '@/config';

export const server = app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'tests') {
        console.log(`⚡️[NODE_ENV]: ${NODE_ENV}`);
        console.log(
            `⚡️[server]: Server is running at http://localhost:${PORT}`,
        );

        logger.info(`=================================`);
        logger.info(`======= ENV: ${NODE_ENV} ========`);
        logger.info(
            `🚀 [server]: Server is running at http://localhost:${PORT}`,
        );
        logger.info(`=================================`);
    }
});

describe('GET /', () => {
    it('should return a 200 status and a message', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Ok');
    });
});

describe('GET /non-existent', () => {
    it('should return a 404 status', async () => {
        const response = await request(app).get('/non-existent');
        expect(response.status).toBe(404);
    });
});

afterAll(() => {
    server.close();
});
