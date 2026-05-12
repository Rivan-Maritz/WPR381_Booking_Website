const Enquire = require("../models/Enquiry");

const submitEnquiry = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log('=== SUBMIT ENQUIRY DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Extracted fields:', { name, email, subject, message });
    console.log('Session userId:', req.session?.userId);
    console.log('Full session:', req.session);


    const newEnquiry = new Enquire({
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

module.exports = {
  submitEnquiry,
};
