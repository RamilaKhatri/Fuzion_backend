const Booking = require("../models/Booking");

const validStatuses = ["Pending", "Approved", "Rejected", "Completed", "Cancelled"];

const createBooking = async (req, res, next) => {
  try {
    const { name, email, phone, date, time, guests, service, message } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ message: "Name, email and phone are required" });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Please enter a valid email" });
    if (guests !== undefined && (!Number.isInteger(Number(guests)) || Number(guests) < 1)) {
      return res.status(400).json({ message: "Guests must be a positive number" });
    }
    const booking = await Booking.create({
      name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(),
      date: date || null, time: time || null, guests: guests ? Number(guests) : null,
      service: service || null, message: message || null
    });
    try {
      const { createNotification } = require("../services/notificationService");
      createNotification({ type: "booking", title: "New Booking", message: `${booking.name} submitted a new booking.`, link: "/bookings.html", relatedId: booking.id });
    } catch (_) {}
    res.status(201).json({ message: "Booking submitted successfully", booking });
  } catch (error) { next(error); }
};

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({ order: [["createdAt", "DESC"]] });
    res.json(bookings);
  } catch (error) { next(error); }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) { next(error); }
};

const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    const { name, email, phone, date, time, guests, service, message, status } = req.body;
    if (status && !validStatuses.includes(status)) return res.status(400).json({ message: "Invalid booking status" });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Please enter a valid email" });
    await booking.update({
      name: name ?? booking.name, email: email ? email.toLowerCase() : booking.email,
      phone: phone ?? booking.phone, date: date ?? booking.date, time: time ?? booking.time,
      guests: guests === undefined ? booking.guests : (guests === "" ? null : Number(guests)),
      service: service ?? booking.service, message: message ?? booking.message,
      status: status ?? booking.status
    });
    res.json({ message: "Booking updated successfully", booking });
  } catch (error) { next(error); }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    const { status } = req.body;
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid booking status" });
    await booking.update({ status });
    res.json({ message: "Booking status updated successfully", booking });
  } catch (error) { next(error); }
};

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    await booking.destroy();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) { next(error); }
};

module.exports = { createBooking, getBookings, getBookingById, updateBooking, updateBookingStatus, deleteBooking };
