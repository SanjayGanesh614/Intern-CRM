import dotenv from 'dotenv';
dotenv.config();
export const env = {
    port: Number(process.env.PORT || 4000),
    mongoUri: process.env.MONGODB_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY || '721a1d5159mshe567e9dd3e9a48ep1f5af1jsn133a0d5ed151',
};
