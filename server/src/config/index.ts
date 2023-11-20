import { config } from 'dotenv';
config({
    path: `.env.${process.env.NODE_ENV || 'development'}.local`,
});

type ConfigVars = Record<string, string>;

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
    NODE_ENV,
    PORT,
    LOG_FORMAT,
    LOG_DIR,
    RAVEN_URL,
    RAVEN_DATABASE,
    RAVEN_PASSWORD,
} = process.env as ConfigVars;
