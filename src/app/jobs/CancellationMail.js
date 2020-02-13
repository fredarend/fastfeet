import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { deliveryProblem } = data;

    await Mail.sendMail({
      to: `${deliveryProblem.delivery.deliveryMan.name} <${deliveryProblem.delivery.deliveryMan.email}>`,
      subject: 'Entrega Cancelada!',
      template: 'cancellation',
      context: {
        descriptionProblem: deliveryProblem.description,
        deliveryId: deliveryProblem.delivery_id,
        product: deliveryProblem.delivery.product,
        deliveryMan: deliveryProblem.delivery.deliveryMan.name,
        recipientName: deliveryProblem.delivery.recipient.name,
        street: deliveryProblem.delivery.recipient.street,
        number: deliveryProblem.delivery.recipient.number,
        city: deliveryProblem.delivery.recipient.city,
        state: deliveryProblem.delivery.recipient.state,
        zipcode: deliveryProblem.delivery.recipient.zipcode
      }
    });
  }
}

export default new CancellationMail();
