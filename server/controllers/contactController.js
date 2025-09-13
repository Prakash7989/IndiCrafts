const Contact = require("../models/Contact");

// @desc Submit contact form
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Name, email, subject, and message are required fields",
      });
    }

    // Check for spam (simple rate limiting)
    const recentSubmissions = await Contact.countDocuments({
      email,
      createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) }, // Last 15 minutes
    });

    if (recentSubmissions >= 3) {
      return res.status(429).json({
        message: "Too many submissions. Please wait before submitting again.",
      });
    }

    // Create contact submission
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
    };

    const contact = new Contact(contactData);
    await contact.save();

    // Log the submission for development
    console.log("📧 New Contact Form Submission:");
    console.log(`From: ${contact.name} (${contact.email})`);
    console.log(`Subject: ${contact.subject}`);
    console.log(`Message: ${contact.message.substring(0, 100)}...`);

    res.status(201).json({
      message: "Thank you for your message! We'll get back to you soon.",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({
      message: "Failed to submit your message. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc Get all contact submissions (Admin only)
const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("respondedBy", "name email")
      .select("-__v");

    const total = await Contact.countDocuments(filter);

    res.json({
      contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalContacts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({
      message: "Failed to fetch contact submissions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc Get single contact submission (Admin only)
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id)
      .populate("respondedBy", "name email")
      .select("-__v");

    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }

    res.json({ contact });
  } catch (error) {
    console.error("Get contact error:", error);
    res.status(500).json({
      message: "Failed to fetch contact submission",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc Update contact status (Admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, response } = req.body;
    const adminId = req.user.id;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }

    // Update fields
    if (status) contact.status = status;
    if (priority) contact.priority = priority;
    if (response) {
      contact.response = response;
      contact.respondedBy = adminId;
      contact.respondedAt = new Date();
    }

    await contact.save();

    res.json({
      message: "Contact status updated successfully",
      contact,
    });
  } catch (error) {
    console.error("Update contact error:", error);
    res.status(500).json({
      message: "Failed to update contact status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc Delete contact submission (Admin only)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }

    res.json({ message: "Contact submission deleted successfully" });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({
      message: "Failed to delete contact submission",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc Get contact statistics (Admin only)
const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: null,
          totalContacts: { $sum: 1 },
          newContacts: {
            $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] },
          },
          inProgressContacts: {
            $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] },
          },
          resolvedContacts: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
          },
          urgentContacts: {
            $sum: { $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0] },
          },
        },
      },
    ]);

    const monthlyStats = await Contact.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      overview: stats[0] || {
        totalContacts: 0,
        newContacts: 0,
        inProgressContacts: 0,
        resolvedContacts: 0,
        urgentContacts: 0,
      },
      monthlyStats,
    });
  } catch (error) {
    console.error("Get contact stats error:", error);
    res.status(500).json({
      message: "Failed to fetch contact statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
};
