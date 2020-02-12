import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryIdProblemController {
  async index(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists!' });
    }

    const deliveryProblems = await DeliveryProblem.findAll({
      where: { delivery_id: id },
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'description'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product']
        }
      ]
    });

    if (!deliveryProblems) {
      return res.status(400).json({
        error: 'Problems not found for this delivery!'
      });
    }

    return res.json(deliveryProblems);
  }
}

export default new DeliveryIdProblemController();
