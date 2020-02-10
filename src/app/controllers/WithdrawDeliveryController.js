/* import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt'; */
import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';

class WithdrawDeliveryController {
  async index(req, res) {
    const { id } = req.params;

    const deliveryManExists = await DeliveryMan.findByPk(id);

    if (!deliveryManExists) {
      return res.status(400).json({ error: 'Delivery Man not exists!' });
    }

    const deliveries = await Delivery.findAll({
      attributes: ['id', 'product'],
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null
      }
    });

    return res.json(deliveries);
  }
}

export default new WithdrawDeliveryController();
