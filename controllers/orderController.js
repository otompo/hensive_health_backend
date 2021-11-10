import shortId from 'shortid';
import Drug from '../models/drugsModel';
import Order from '../models/orderModel';

// Create a new order   =>  /api/order
export const createOrder = async (req, res, next) => {
  let orderId = shortId.generate();
  const { orderItems, itemsPrice, taxPrice, totalPrice } = req.body;

  const order = await Order.create({
    orderId,
    orderItems,
    itemsPrice,
    taxPrice,
    totalPrice,
    // paymentInfo,
    paidAt: Date.now(),
    seller: req.user._id,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
};

// Get single order   =>   /api/order/:orderId
export const getSingleOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ orderId }).populate(
    'seller',
    'name email role',
  );

  if (!order) return res.status(404).send('No Order found with this ID');

  res.status(200).json({
    success: true,
    order,
  });
};

// Get logged in pharmacist orders   =>   /api/orders/me
export const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user._id }).populate(
      'seller',
      'name',
    );
    res.send({ total: orders.length, orders });
  } catch (err) {
    console.log(err);
  }
};

// Get all orders - ADMIN  =>   /api/orders/
export const allOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).exec();

    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  } catch (err) {
    console.log(err);
  }
};

// Update / Process order - ADMIN  =>   /api/order/:id
export const updateOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(400).send('Order not found');
  if (order.orderStatus === 'Delivered')
    return res.status(400).send('You have already delivered this order');

  order.orderItems.forEach(async (item) => {
    await updateStock(item.drug, item.quantity);
  });

  (order.orderStatus = req.body.status), (order.paidAt = Date.now());

  await order.save();

  res.status(200).json({
    success: true,
  });
};

async function updateStock(id, quantity) {
  const drug = await Drug.findById(id);

  drug.stock = drug.stock - quantity;

  await drug.save({ validateBeforeSave: false });
}

// Delete order   =>   /api/order/:id
export const deleteOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(400).send('Order not found');

  await order.remove();

  res.status(200).json({
    success: true,
  });
};
