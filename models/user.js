var express = require('express');
var router = express.Router();
const dbConnection = require('../database');
const user = {};
// User.createUser = function createUser(newUser) {
//     bcrypt.genSalt(10, function(err, salt){
//         bcrypt.hash(newUser.password,salt, function (err, hash) {
//             newUser.password = hash;
//             var query = sql.query("INSERT INTO USERS set ?", newUser, function (err, res) {
//                 console.log(query);
//                 if(err) {
//                     console.log("error");
//                 }
//                 else{

//                     console.log(res.insertId);
//                 }
//             });
//         });
//     });

// }

user.checkUserEmailExist = function checkUserEmailExist(email) {
  
  var userres = dbConnection.query('SELECT email FROM `users` WHERE `email`=?', [email], function(err, results) {
     return results.length;  
  });
  return userres;
}

module.exports= user;
