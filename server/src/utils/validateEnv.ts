import { cleanEnv, port, str } from 'envalid';

import dotenv from 'dotenv';
dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'development'}.local`,
});

function validateEnv() {
    cleanEnv(process.env, {
        NODE_ENV: str(),
        PORT: port(),
    });
}

export default validateEnv;
