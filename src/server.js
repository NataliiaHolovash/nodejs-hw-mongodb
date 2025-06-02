
import express from 'express';
import cors from 'cors';
import router from './routers/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();

    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());
    app.use('/auth', authRouter);
    app.use('/contacts', router);
    app.use('/contacts/:id', router);
    app.use(notFoundHandler);
    app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

