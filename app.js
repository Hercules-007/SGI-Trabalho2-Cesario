// app.js
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
require('./config/passport');
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// EJS
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/items', require('./routes/item'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
