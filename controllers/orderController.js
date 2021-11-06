import shortId from 'shortid';
import Order from '../models/orderModel';

export const createOrder = (req, res) => {
  console.log('CREATE ORDER: ', req.body);
  //   req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: 'can not create',
      });
    }
    res.json(data);
  });
};
