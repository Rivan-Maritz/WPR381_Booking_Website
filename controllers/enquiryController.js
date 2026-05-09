const Enquire = require("../models/Enquiry");

const submitEnquiry = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const newEnquiry = new Enquire({
      name,
      email,
      subject,
      message,

      user: req.session && req.session.userId ? req.session.userId : null,
    });

    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry submitted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitEnquiry,
};
