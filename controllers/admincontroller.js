const User = require("../models/User");
const MenuItem = require("../models/MenuItem");
const Enquiry = require("../models/Enquiry");
const Booking = require("../models/Booking");
const Order = require("../models/Order");
const Project = require("../models/Project");
const Gallery = require("../models/Gallery");

const getDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers, totalMenuItems, totalEnquiries, totalBookings,
      totalOrders, totalProjects, totalGalleryItems,
      pendingBookings, pendingEnquiries
    ] = await Promise.all([
      User.count(), MenuItem.count(), Enquiry.count(), Booking.count(),
      Order.count(), Project.count(), Gallery.count(),
      Booking.count({ where: { status: "Pending" } }),
      Enquiry.count({ where: { status: "Pending" } })
    ]);

    const [recentBookings, recentEnquiries, recentOrders] = await Promise.all([
      Booking.findAll({ order: [["createdAt", "DESC"]], limit: 5 }),
      Enquiry.findAll({ order: [["createdAt", "DESC"]], limit: 5 }),
      Order.findAll({ order: [["createdAt", "DESC"]], limit: 5 })
    ]);

    res.json({
      message: "Admin dashboard data",
      statistics: {
        totalUsers, totalMenuItems, totalEnquiries, totalBookings,
        totalOrders, totalProjects, totalGalleryItems, pendingBookings, pendingEnquiries
      },
      recent: { bookings: recentBookings, enquiries: recentEnquiries, orders: recentOrders }
    });
  } catch (error) { next(error); }
};

module.exports = { getDashboard };
