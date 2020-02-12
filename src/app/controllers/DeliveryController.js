import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';

import Queue from '../../lib/Queue';
import CreateMail from '../jobs/CreateMail';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    // delivery man exists?
    const deliveryManExists = await DeliveryMan.findOne({
      where: { id: req.body.deliveryman_id },
      attributes: ['name', 'email']
    });

    if (!deliveryManExists) {
      return res.status(400).json({ error: 'Delivery Man does not exists' });
    }

    // recipient exists?
    const recipientExists = await Recipient.findOne({
      where: { id: req.body.recipient_id },
      attributes: ['name', 'street', 'number', 'city', 'state', 'zipcode']
    });

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const { id, recipient_id, deliveryman_id, product } = await Delivery.create(
      req.body
    );

    await Queue.add(CreateMail.key, {
      product,
      recipient: recipientExists,
      deliveryMan: deliveryManExists
    });

    return res.json({ id, recipient_id, deliveryman_id, product });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    // delivery man exists?
    const deliveryManExists = await DeliveryMan.findOne({
      where: { id: req.body.deliveryman_id }
    });

    if (!deliveryManExists) {
      return res.status(400).json({ error: 'Delivery Man does not exists' });
    }

    // recipient exists?
    const recipientExists = await Recipient.findOne({
      where: { id: req.body.recipient_id }
    });

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const { id, product, recipient_id, deliveryman_id } = await delivery.update(
      req.body
    );

    return res.json({ id, product, recipient_id, deliveryman_id });
  }

  async index(req, res) {
    const deliveries = await Delivery.findAll({
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
    });

    return res.json(deliveries);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Delivery.destroy({
      where: {
        id
      }
    });

    return res.json({ ok: 'Deleted' });
  }
}

export default new DeliveryController();
