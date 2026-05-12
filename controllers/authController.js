const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("An account with this email already exists.");
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
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }

    //res.status(200).send(`Login successful! Welcome back, ${user.name}.`);
    res.redirect("/events/home");
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).send("Internal Server Error");
  }
};

const logoutUser = async (req, res) => {
  try{
    req.session.destroy(() => {
      res.redirect("/auth/login");
    })
  }catch(error){
    console.error("Error during logout.");
    res.status(500).send("Internal server error.")
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
