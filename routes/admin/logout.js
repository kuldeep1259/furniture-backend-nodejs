var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
  //session destroy
  req.session = null;
  res.redirect('/admin');
});

module.exports = router;