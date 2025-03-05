const express = require("express");
const router = express.Router();
const Notification = require("../Models/Notification");
const ensureAuthenticated = require("../Middlewares/Auth");

router.post("/add", ensureAuthenticated, async (req, res) => {
  try {
    const { message, dueDate } = req.body;

    if (!message || !dueDate) {
      return res
        .status(400)
        .json({ message: "Message and dueDate are required" });
    }

    const newNotification = new Notification({
      userId: req.user.id,
      message,
      dueDate,
      isRead: false,
    });

    await newNotification.save();
    res
      .status(201)
      .json({ message: "Notification added successfully", newNotification });
  } catch (error) {
    console.log("Error adding notification:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.log("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error });
  }
});

router.get("/unread", ensureAuthenticated, async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });
    res.status(200).json({ unreadCount });
  } catch (error) {
    console.log("Error fetching unread count:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/mark-read/:id", ensureAuthenticated, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({
      message: "Notification marked as read & deleted",
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
});

module.exports = router;
