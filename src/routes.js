import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import WithdrawDeliveryController from './app/controllers/WithdrawDeliveryController';
import DeliveredController from './app/controllers/DeliveredController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import DeliveryIdProblemController from './app/controllers/DeliveryIdProblemController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// Create Session
routes.post('/sessions', SessionController.store);

// Withdraw and View Deliveries
routes.get('/deliveryman/:id', WithdrawDeliveryController.index);
routes.put(
  '/deliveryman/:deliveryMan_id/delivery/:delivery_id',
  WithdrawDeliveryController.update
);

// Delivered
routes.get('/delivered/:deliveryMan_id', DeliveredController.index);
routes.put(
  '/delivered/:deliveryMan_id/delivery/:delivery_id',
  upload.single('file'),
  DeliveredController.update
);

// Delivery Problemas
routes.post('/delivery/:id/problems', DeliveryProblemController.store);

routes.use(authMiddleware);

// Recipients
routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);

// Deliverymen
routes.post('/deliverymen', DeliveryManController.store);
routes.get('/deliverymen', DeliveryManController.index);
routes.put('/deliverymen/:id', DeliveryManController.update);
routes.delete('/deliverymen/:id', DeliveryManController.destroy);

// Files
routes.post('/files', upload.single('file'), FileController.store);

// Deliveries
routes.post('/delivery', DeliveryController.store);
routes.get('/delivery', DeliveryController.index);
routes.delete('/delivery/:id', DeliveryController.delete);
routes.put('/delivery/:id', DeliveryController.update);

// Deliverie Problems
routes.get('/deliveries/problems', DeliveryProblemController.index);
routes.get('/delivery/:id/problems', DeliveryIdProblemController.index);

export default routes;
