import Mail from '../../lib/Mail';

class CreateMail {
  get key() {
    return 'CreateMail';
  }

  async handle({ data }) {
    const { deliveryMan, recipient, product } = data;

    await Mail.sendMail({
      to: `${deliveryMan.name} <${deliveryMan.email}>`,
      subject: 'Nova Entrega!',
      template: 'create',
      context: {
        product,
        deliveryMan: deliveryMan.name,
        recipientName: recipient.name,
        street: recipient.street,
        number: recipient.number,
        city: recipient.city,
        state: recipient.state,
        zipcode: recipient.zipcode
      }
    });
  }
}

export default new CreateMail();
