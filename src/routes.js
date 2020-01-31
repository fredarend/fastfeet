import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ messagem: 'ok' });
});

// routes.post('/users', UserController.store);

export default routes;
