import { isBefore, isAfter, startOfHour, setHours, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';

class WithdrawDeliveryController {
  async index(req, res) {
    const { id } = req.params;

    const deliveryManExists = await DeliveryMan.findByPk(id);

    if (!deliveryManExists) {
      return res.status(400).json({ error: 'Delivery Man not exists!' });
    }

    const deliveries = await Delivery.findAll({
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null
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
        }
      ]
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const { deliveryMan_id, delivery_id } = req.params;

    const deliveryManExists = await DeliveryMan.findByPk(deliveryMan_id);

    if (!deliveryManExists) {
      return res.status(400).json({ error: 'Delivery Man does not exists!' });
    }

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists!' });
    }

    if (delivery.start_date) {
      return res
        .status(400)
        .json({ error: 'Delivery has already been withdraw' });
    }

    const deliveryIsFromTheDeliveryMan = await Delivery.findOne({
      where: { id: delivery_id },
      include: [
        {
          model: DeliveryMan,
          as: 'deliveryMan',
          where: { id: deliveryMan_id }
        }
      ]
    });

    if (!deliveryIsFromTheDeliveryMan) {
      return res
        .status(400)
        .json({ error: 'Delivery does not belong to the delivery man' });
    }

    const { start_date } = req.body;
    const date = parseISO(start_date);

    const hourInit = setHours(startOfHour(date), 8);
    const hourFinish = setHours(startOfHour(date), 18);

    if (isBefore(date, hourInit) || isAfter(date, hourFinish)) {
      return res.status(400).json({
        error: 'Delivery withdrawals must be made between 8am and 18pm'
      });
    }

    const countDeliveries = await Delivery.count({
      where: {
        canceled_at: null,
        start_date: { [Op.between]: [hourInit, hourFinish] }
      }
    });

    if (countDeliveries >= 5) {
      return res
        .status(400)
        .json({ error: 'The withdrawal limit is 5 per day.' });
    }

    delivery.start_date = date;

    await delivery.save();

    return res.json(delivery);
  }
}

export default new WithdrawDeliveryController();
