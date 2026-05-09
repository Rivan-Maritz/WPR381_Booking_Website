const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("An account this email already exists.");
    }

    const newUser = new User({ name, email, password, phone });
    await newUser.save();

    res.status(201).send("Registration successful! You can now log in.");
  } catch (error) {
    console.error("Error during registration: ", error);
    res.status(500).send("Internal Server Error");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, passward } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }

    res.status(200).send("Login successful! Welcome back, ${user.name}.");
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  registerUser,
  loginUser,
};
