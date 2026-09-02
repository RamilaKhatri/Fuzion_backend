const Order = require("../models/Order");
const validStatuses = ["Pending", "Preparing", "Completed", "Cancelled"];

const createOrder = async (req, res, next) => {
  try {
    const { customerName, phone, items, totalAmount } = req.body;
    if (!customerName || !phone || !items || totalAmount === undefined) {
      return res.status(400).json({ message: "Customer name, phone, items and total amount are required" });
    }
    if (isNaN(totalAmount) || Number(totalAmount) < 0) return res.status(400).json({ message: "Please enter a valid total amount" });
    const order = await Order.create({
      customerName: customerName.trim(), phone: phone.trim(),
      items: typeof items === "string" ? items : JSON.stringify(items),
      totalAmount: Number(totalAmount), status: "Pending"
    });
    try {
      const { createNotification } = require("../services/notificationService");
      createNotification({ type: "order", title: "New Order", message: `${order.customerName} placed a new order.`, link: "/orders.html", relatedId: order.id });
    } catch (_) {}
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) { next(error); }
};

const getOrders = async (req, res, next) => {
  try { res.json(await Order.findAll({ order: [["createdAt", "DESC"]] })); }
  catch (error) { next(error); }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) { next(error); }
};

const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const { customerName, phone, items, totalAmount, status } = req.body;
    if (!customerName || !phone || !items || totalAmount === undefined) return res.status(400).json({ message: "Customer name, phone, items and total amount are required" });
    if (isNaN(totalAmount) || Number(totalAmount) < 0) return res.status(400).json({ message: "Please enter a valid total amount" });
    if (status && !validStatuses.includes(status)) return res.status(400).json({ message: "Invalid order status" });
    await order.update({
      customerName: customerName.trim(), phone: phone.trim(),
      items: typeof items === "string" ? items : JSON.stringify(items),
      totalAmount: Number(totalAmount), status: status || order.status
    });
    res.json({ message: "Order updated successfully", order });
  } catch (error) { next(error); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const { status } = req.body;
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid order status" });
    await order.update({ status });
    res.json({ message: "Order status updated successfully", order });
  } catch (error) { next(error); }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    await order.destroy();
    res.json({ message: "Order deleted successfully" });
  } catch (error) { next(error); }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrder, updateOrderStatus, deleteOrder };
