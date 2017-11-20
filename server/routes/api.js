const express = require('express');
const User = require('mongoose').model('User');
const config = require('../../config');
const jwt = require('jsonwebtoken');

const router = new express.Router();

router.get('/dashboard', (req, res) => {
  console.log(req.cookies);
  jwt.verify(req.headers.authorization.split(' ')[1], config.jwtSecret, (err, decoded) => {
    if (err) {console.log(err);}
    else{console.log(decoded);}
  })
  console.log('req.session.id',req.session.id);
  res.status(200).json({
    message: "You're authorized to see this secret message."
  });
});


module.exports = router;
