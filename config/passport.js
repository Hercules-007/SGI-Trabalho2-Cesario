const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // callbackURL: '/auth/google/callback',
  callbackURL: 'production' ? 'https://sgi-trabalho2-cesario-v2.vercel.app/auth/google/callback' : 'http://localhost:3000/auth/google/callback';
}, async (accessToken, refreshToken, profile, done) => {
  const newUser = {
    googleId: profile.id,
    username: profile.displayName,
    email: profile.emails[0].value
  };

  try {
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user);
    } else {
      user = await User.create(newUser);
      return done(null, user);
    }
  } catch (err) {
    console.error(err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
