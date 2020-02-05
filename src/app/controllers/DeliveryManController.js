import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

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
    const deliveryMan = await DeliveryMan.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url']
        }
      ]
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

    const deliveryMan = await DeliveryMan.findByPk(req.params.id);

    if (email) {
      const deliveryManExists = await DeliveryMan.findOne({
        where: { email: req.body.email }
      });

      if (deliveryManExists) {
        return res.status(400).json({ error: 'Deliveryman already exists!' });
      }
    }

    const { id, name } = await deliveryMan.update(req.body);

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
