const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { next(e); }
};
