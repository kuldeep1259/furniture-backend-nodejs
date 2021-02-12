var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var path = require('path');
const bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dbConnection = require('../../database');
const cookieSession = require('cookie-session');
const { body, validationResult } = require('express-validator');
var http = require('http');

const ifNotLoggedin = (req, res, next) => {
  if(!req.session.isLoggedIn){
      return  res.redirect('/admin');
  }
  next();
}

const ifLoggedin = (req,res,next) => {
  if(req.session.isLoggedIn){
      return res.render('admin/pages/products/product-listing',{
        username: req.session.userName
      });
  }
  next();
}

router.get('/',ifLoggedin, (req,res,next) => {
  next();
});
 router.get('/', ifNotLoggedin, (req,res,next) => {
  next();
 });

 

module.exports = router;