exports.setup = function(app) {
 
  app.get('/dashboard', (req,res,next) => {
      return res.render('admin/pages/dashboard',{
        username: req.session.userName
      });
  });

};