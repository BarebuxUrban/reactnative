const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { Sequelize, DataTypes }  = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

app.use(express.json());
app.use(cors())

dotenv.config();

const sequelize = new Sequelize( process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  serial_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  verificationToken:  {
    type: DataTypes.STRING,
    allowNull: true
  },
});

const CoffeeMachine = sequelize.define('coffee_machine', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  serial_number: {
    type: DataTypes.STRING,
    unique: true
  }
},{
  tableName: 'coffee_machine' 
});

const Cups = sequelize.define('cup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  cups_amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  coffeeMachineId: {
    type: DataTypes.INTEGER,
    references: {
      model: CoffeeMachine,
      key: 'id' 
    }
  }
});

CoffeeMachine.belongsTo(User, { foreignKey: 'userId', allowNull: true });
User.hasMany(CoffeeMachine);

Cups.belongsTo(CoffeeMachine, { foreignKey: 'serial_number', allowNull: true });
Cups.belongsTo(CoffeeMachine, { foreignKey: 'coffeeMachineId', allowNull: true });
Cups.belongsTo(User, { foreignKey: 'userId', allowNull: true });
CoffeeMachine.hasMany(Cups);

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    },
});

app.get('/api/register', (req, res) => {
  res.send('pizda')
});

app.post('/api/register', async (req, res) => {


    const { name, surname, email, password, serial_number } = req.body;
    
    try {
      const machine = await CoffeeMachine.findOne({ where: { serial_number, userId: null } });
  
      if (machine) {
        const existingUser = await User.findOne({ where: { email } });
  
        if (existingUser) {
          return res.status(400).send('User with this email already exists');
        }
  
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({ name, surname, email, password: hashedPassword, serial_number, verificationToken });
        
        const verificationUrl = `http://localhost:${process.env.PORT}/verify/${verificationToken}`;
        
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'verify email',
          text: `Click this link to verify your email: ${verificationUrl}`
        };
  
        await transporter.sendMail(mailOptions);
        
        const userId = user.id;
        const coffeeMachineId = machine.id;
  
        const cups = await Cups.create({
          serial_number,
          userId,
          coffeeMachineId
        });
  
        await machine.update({ userId });
  
        // Send the response only once
        res.status(200).send('Registration successful, please check your email to verify your account');
      } else {
        res.status(400).send('Invalid serial number');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred during user registration');
    }
});

app.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.isVerified = true;
    await user.save();

    res.status(200).send('Email verified successfully!');
  } catch (error) {
    console.error('Verification error:', error);
    res.status(400).send('Invalid token');
  }
});

app.post('/send', async (req, res) => {
  const {serial_number, cups_amount } = req.body;

  try {
    const cups = await Cups.findOne({ where: { serial_number } });
    if(cups) {
      await Cups.update({ cups_amount }, { where: { serial_number } });
      res.send(cups_amount)
    } else {
      res.status(400).send('wrong credentials')
    }
  } catch (error) {
      console.log(error)
      res.status(500).send('error naxui')
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log('Received token:', token);  // Log the received token

  if (!token) {
      return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token.replace('Bearer ', ''), 'super_secret', (err, decoded) => {
      if (err) {
          console.error('Token verification error:', err);
          return res.status(500).json({ error: 'Failed to authenticate token' });
      }

      req.userId = decoded.id;
      next();
  });
};

app.get('/users', verifyToken, async (req, res) => {
  try {
      const data = await User.findAll({ where: { userId: req.userId } });
      res.json(data);
  } catch (error) {
      console.error('Error fetching users:', error);  // Log the complete error
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

app.get('/cups', async (req, res) => {
  try {
    const id = req.query.id; // Get 'id' from query parameters

    const cups = await Cups.findByPk(id);
    if (cups) {
      res.json(cups);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});


app.get('/api/login', (req, res) => {
    res.send('pizda')
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, 'secret', { expiresIn: '1h' });
    
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(5000, () => {
  console.log('server started')
})