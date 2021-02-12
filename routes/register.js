var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const dbConnection = require('../database');
const userModel= require("../models/user");
const bcrypt = require('bcryptjs');
// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
  if(!req.session.isLoggedIn){
      return res.render('pages/index');
  }
  next();
}
const ifLoggedin = (req,res,next) => {
  if(req.session.isLoggedIn){
      return res.redirect('/');
  }
  next();
}
/* GET users listing. */
router.post('/', ifLoggedin, 
// post data validation(using express-validator)
[
    body('user_email').trim().not().isEmpty().withMessage("Email is required").bail().isEmail().withMessage("Not a valid email").bail().custom((value) => {
          return new Promise((resolve, reject) => {
              //console.log(userModel.checkUserEmailExist(value));
            dbConnection.query('SELECT email FROM `users` WHERE `email`=?', [value], function(err, results) {
                if(results.length > 0) {
                    reject('E-mail already in use');
                }
                resolve();
              });
          });
    }),
    body('user_name','Username is Empty!').trim().not().isEmpty(),
    body('user_pass','The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
],// end of post data validation
(req,res,next) => {

    const validation_result = validationResult(req);
    const {user_name, user_pass, user_email, user_phone } = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcryptjs)
        // bcrypt.hash(user_pass, 12).then((hash_pass) => {
        //     // INSERTING USER INTO DATABASE
        //     dbConnection.query("INSERT INTO `users`(`name`,`email`,`phone`,`password`) VALUES(?,?,?,?)",[user_name,user_email,user_phone, hash_pass])
        //     .then(result => {
        //         res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`);
        //     }).catch(err => {
        //         // THROW INSERTING USER ERROR'S
        //         if (err) throw err;
        //     });
        // })
        // .catch(err => {
        //     // THROW HASING ERROR'S
        //     if (err) throw err;
        // })


        return new Promise((resolve, reject) => {
            bcrypt.hash(user_pass, 12).then((hash_pass) => {
                dbConnection.query("INSERT INTO `users`(`name`,`email`,`phone`,`password`) VALUES(?,?,?,?)",[user_name,user_email,user_phone, hash_pass], function(err, results) {
                    if(err) {
                        reject('There is some error while inserting the record');
                        
                    }else{
                        res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`);
                        resolve();
                    }
                });
            });
        });



    }
    else{
        // COLLECT ALL THE VALIDATION ERRORS
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH VALIDATION ERRORS
        res.render('pages/index',{
            register_error:allErrors,
            old_data:req.body
        });
    }
});// END OF REGISTER PAGE

module.exports = router;
