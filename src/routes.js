import { Router } from 'express';
// import User from './app/models/User';
import Recipient from './app/models/Recipient';

const routes = new Router();

routes.get('/', async (req, res) => {
  const recipient = await Recipient.create({
    name: 'Cleide Léa Weber',
    street: 'Rua Luis Sfredo',
    number: '58-d',
    complement: 'Apartamento',
    state: 'SC',
    city: 'Seara',
    zipcode: '89770000'
  });

  res.json(recipient);
});

// routes.post('/users', UserController.store);

export default routes;
