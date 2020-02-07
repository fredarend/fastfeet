import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import Delivery from './app/controllers/DeliveryController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliverymen', DeliveryManController.store);
routes.get('/deliverymen', DeliveryManController.index);
routes.put('/deliverymen/:id', DeliveryManController.update);
routes.delete('/deliverymen/:id', DeliveryManController.destroy);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/delivery', Delivery.store);
routes.get('/delivery', Delivery.index);
routes.delete('/delivery/:id', Delivery.delete);
routes.put('/delivery/:id', Delivery.update);

export default routes;
