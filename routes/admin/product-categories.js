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
      return res.render('admin/pages/products/product-categories',{
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

 router.post('/', ifNotLoggedin, [
  
  body('category_name','Category name is required!').trim().not().isEmpty(),
], (req, res) => {
  const validation_result = validationResult(req);
  const {category_name, category_slug, parent_category, category_description, cat_thumbnail} = req.body;
  if(validation_result.isEmpty()){

    return new Promise((resolve, reject) => {
      // dbConnection.query('SELECT * FROM `users` WHERE `email`=?', [user_email], function(err, results) {
      //   if(err) throw err;
      //   bcrypt.compare(user_pass, results[0].password).then(compare_result => {
      //     if(compare_result === true){
      //         req.session.isLoggedIn = true;
      //         req.session.userID = results[0].id;
      //         req.session.userName = results[0].name;

      //         res.redirect('/dashboard');
      //     }
      //     else{
      //         res.render('admin/pages/login',{
      //             login_errors:['Invalid Password!']
      //         });
      //     }
      // });
        
      // });
    });
  }
  else{
    //res.send('validation works');
      let allErrors = validation_result.errors.map((error) => {
          return error.msg;
      });
      // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
      res.render('admin/pages/products/product-categories',{
        username: req.session.userName, 
          cat_errors:allErrors
      });
  }
});

 

module.exports = router;