const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

router.get('/dashboard', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  try {
    const items = await Item.find({ user: req.user.id });
    res.render('dashboard', { user: req.user, items });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;
