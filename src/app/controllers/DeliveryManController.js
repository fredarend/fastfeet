import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';

class DeliveryManController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const deliveryManExists = await DeliveryMan.findOne({
      where: { email: req.body.email }
    });

    if (deliveryManExists) {
      return res.status(400).json({ error: 'Delivery Man already exists!' });
    }

    const { id, name, email } = await DeliveryMan.create(req.body);

    return res.json({ id, name, email });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveryMan = await DeliveryMan.findAll({
      attributes: ['id', 'name', 'email'],
      order: ['created_at'],
      limit: 20,
      ofsset: (page - 1) * 20
    });

    return res.json(deliveryMan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { email } = req.body;

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { email: req.body.email }
      });

      if (deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman already exists!' });
      }
    }

    const { id, name } = await deliveryman.update(req.body);

    return res.json({ id, name, email });
  }

  async destroy(req, res) {
    const { id } = req.params;

    await DeliveryMan.destroy({
      where: {
        id
      }
    });

    return res.json();
  }
}

export default new DeliveryManController();
