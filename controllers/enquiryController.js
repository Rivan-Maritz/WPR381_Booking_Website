const Enquiry = require("../models/Enquiry");

const submitEnquiry = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log('=== SUBMIT ENQUIRY DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Extracted fields:', { name, email, subject, message });
    console.log('Session userId:', req.session?.userId);
    console.log('Full session:', req.session);

    const newEnquiry = new Enquiry({
      name,
      email,
      subject,
      message,
      user: req.session && req.session.userId ? req.session.userId : null,
    });

    await newEnquiry.save();
    res.redirect('/events/home');
  } catch (error) {
    next(error);
  }
};

const getManageContact = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.render('enquiries/manageContact', { enquiries });
  } catch (error) {
    next(error);
  }
};

const updateEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminReply, status, priority } = req.body;

    const updates = {
      status,
      priority,
    };

    if (adminReply !== undefined) {
      updates.adminReply = adminReply;
      updates.repliedAt = adminReply.trim() ? new Date() : null;
    }

    await Enquiry.findByIdAndUpdate(id, updates, { runValidators: true });

    res.redirect('/enquiries/manageContact');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitEnquiry,
  getManageContact,
  updateEnquiry,
};
