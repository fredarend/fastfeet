import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import DeliveryProblem from '../models/DeliveryProblem';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveryProblems = await DeliveryProblem.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'description'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: [
                'id',
                'name',
                'street',
                'number',
                'complement',
                'city',
                'state',
                'zipcode'
              ]
            },
            {
              model: DeliveryMan,
              as: 'deliveryMan',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists!' });
    }

    const deliveryProblemsData = {
      delivery_id: Number(id),
      ...req.body
    };

    const { delivery_id, description } = await DeliveryProblem.create(
      deliveryProblemsData
    );

    return res.json({ id: Number(id), description, delivery_id });
  }

  async update(req, res) {
    const { id } = req.params;

    const deliveryProblem = await DeliveryProblem.findByPk(id, {
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product', 'canceled_at'],
          include: [
            {
              model: DeliveryMan,
              as: 'deliveryMan',
              attributes: ['name', 'email']
            },
            {
              model: Recipient,
              as: 'recipient',
              attributes: [
                'name',
                'street',
                'number',
                'complement',
                'state',
                'city',
                'zipcode'
              ]
            }
          ]
        }
      ]
    });

    if (!deliveryProblem) {
      return res.status(400).json({ error: 'Problem not found!' });
    }

    if (deliveryProblem.delivery.canceled_at) {
      return res.status(400).json({ error: 'Delivery is already canceled!' });
    }

    const delivery = await Delivery.findByPk(deliveryProblem.delivery_id);

    delivery.canceled_at = new Date();

    await delivery.save();

    await Queue.add(CancellationMail.key, {
      deliveryProblem
    });

    return res.json(delivery);
  }
}

export default new DeliveryProblemController();
