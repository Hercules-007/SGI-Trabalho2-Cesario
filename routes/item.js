const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { ensureAuthenticated } = require('../middleware/auth');

router.post('/create', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newItem = new Item({
      title,
      description,
      user: req.user.id
    });

    await newItem.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item.user.toString() !== req.user.id) {
      return res.redirect('/dashboard');
    }

    await Item.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

module.exports = router;
