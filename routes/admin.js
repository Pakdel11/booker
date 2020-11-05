const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model


const Admin = require('../models/admin');
const { forwardAuthenticated } = require('../config/auth');
const { collection, find } = require('../models/admin');
const db = require('../config/keys').mongoURI;
const mongoose = require('mongoose');
const { response } = require('express');
const { password } = require('../config/emailkey');
const { has } = require('browser-sync');

// Register
router.post('/registerA', (req, res) => {
  const { name, Lastname, email, password, password2} = req.body;
  let errors = [];

  if (!name || !Lastname || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('admin', {
      errors,
      name,
      Lastname,
      email,
      password,
      password2
    });
  } else {
    Admin.findOne({ email: email }).then(admin => {
      if (admin) {
        errors.push({ msg: 'Email already exists' });
        res.render('admin', {
          errors,
          name,
          Lastname,
          email,
          password,
          password2
        });
      } else {
        const newAdmin = new Admin({
          name,
          Lastname,
          email,
          password,
          password2
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin
              .save()
              .then(admin => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/admin');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/loginA', (req, res) => {
    var password = req.body.password;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        password = hash;
        console.log(password)
      
      });
    });
    // const admin = Admin.findOne({password: req.body.password2});
    // console.log(email);
    // const pass = Admin.findOne({password: req.body.password});
    // if(pass)   
    
    
    
    
});
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admin');
});

module.exports = router;