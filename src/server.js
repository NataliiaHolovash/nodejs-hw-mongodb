
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import * as contactsServices from './services/contacts.js';

export const setupServer = () => {
  const app = express();
  const PORT = Number(getEnvVar('PORT', 3000));

  app.use(express.json());
    app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res, next) => {
    try {
      const data = await contactsServices.getAllContacts();
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data,
      });
    } catch (err) {
      next(err);
    }
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const data = await contactsServices.getContactById(contactId);

      if (!data) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }

      res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId} !`,
        data,
      });
    } catch (err) {
      next(err);
    }
  });

  // ❗️ 404 для невідомих маршрутів
  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  // ❗️ Глобальний обробник помилок
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
