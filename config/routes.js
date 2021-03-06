var home = require('../app/controllers/home');
var multer = require('multer');
var upload = multer({ dest: '../uploads/' });
//you can include all your controllers

module.exports = function (app) {

    app.post('/:id/storeData', home.storeData);
    app.post('/:id/storeImage', home.storeImage);
    //app.post('/:id/upload', upload, function(req,res){});
    app.post('/:id/sendQuestion', home.sendQuestion);
    app.get('/:id/story', home.getStory);
    app.post('/storeInfo', home.storeInfo);
    app.get('/getInfo', home.getInfo);
    /*app.get('/signup', home.signup);

    app.get('/', home.loggedIn, home.home);//home
    app.get('/home', home.loggedIn, home.home);//home

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));*/


}
