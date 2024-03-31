const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function signUp(req,res) {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).send('User already exist');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword
          });
          await newUser.save();
          res.status(201).send('User created');
    }catch(err){
        throw new Error(err)
    }
};

async function signIn(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return res.status(401).json({ message: 'Incorrect email or password' });
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Incorrect email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SEED, { expiresIn: '1h' });
        res.status(200).json({ token });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
  }


module.exports= {
    signUp,
    signIn
}