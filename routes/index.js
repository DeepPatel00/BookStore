const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const bookController = require('../controller/bookController');
const passport = require("passport");
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Add these lines before other routes
router.get('/register', (req, res) => res.render('register'));
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
  
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/login');
                })
                .catch(err => console.log(err));
            });
        });
      }
    });
  }
});

router.get("/", bookController.getBooks);

// Login page
router.get('/login', (req, res) => res.render('login'));


// Login handler
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout handler
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

// Book routes
// Replace the existing root path route handler with this one

router.get('/books', ensureAuthenticated, bookController.getBooks);
router.post('/books', ensureAuthenticated, bookController.addBook);
router.put('/books/:id', ensureAuthenticated, bookController.updateBook);
router.delete('/books/:id', ensureAuthenticated, bookController.deleteBook);
// Add book form
router.get('/add-book', ensureAuthenticated, (req, res) => res.render('addBook'));

router.post('/buy', ensureAuthenticated, (req, res) => {
    const bookId = req.body.bookId;
    // Handle the purchase process here
    // For example, redirect to a payment gateway or update the database
  
    res.redirect('/success');
  });
  
module.exports = router;




