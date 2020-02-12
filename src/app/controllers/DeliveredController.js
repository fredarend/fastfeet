import { isBefore } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveredController {
  async index(req, res) {
    const { deliveryMan_id } = req.params;

    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      where: {
        deliveryman_id: deliveryMan_id,
        canceled_at: null,
        end_date: {
          [Op.ne]: null
        },
        signature_id: {
          [Op.ne]: null
        }
      },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
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
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url']
        }
      ]
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const { deliveryMan_id, delivery_id } = req.params;
    const { originalname: name, filename: path } = req.file;

    if (!(name || path)) {
      return res.status(400).json({ error: 'Signature cannot be null!' });
    }

    const deliveryManExists = await DeliveryMan.findByPk(deliveryMan_id);

    if (!deliveryManExists) {
      return res.status(400).json({ error: 'Delivery Man does not exists!' });
    }

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists!' });
    }

    if (!delivery.start_date) {
      return res
        .status(400)
        .json({ error: 'Order has not yet been withdrawn!' });
    }

    if (delivery.end_date) {
      return res
        .status(400)
        .json({ error: 'Order has already been delivered!' });
    }

    const date = new Date();

    if (isBefore(date, delivery.start_date)) {
      return res
        .status(400)
        .json({ error: 'The delivery date must be after the pick-up date.' });
    }

    const file = await File.create({
      name,
      path,
      signature: true
    });

    delivery.signature_id = file.id;
    delivery.end_date = date;

    await delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveredController();
