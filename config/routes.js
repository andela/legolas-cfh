
const async = require('async');
const middleware = require('./middlewares/authorization.js');

module.exports = function (app, passport, auth) {
    // User Routes
  const users = require('../app/controllers/users');
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/chooseavatars', users.checkAvatar);
  app.get('/signout', users.signout);

    // Setting up the users api
  app.post('/users', users.create);
  app.post('/users/avatars', users.avatars);

     // create api routes for signin
  app.post('/api/auth/login', users.Signin);

  app.post('/api/auth/signup', users.createAPI);

    // Donation Routes
  app.post('/donations', users.addDonation);

  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: 'Invalid email or password.'
  }), users.session);

  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

    // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), users.authCallback);

    // Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

    // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.authCallback);

    // Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), users.authCallback);

    // Finish with setting up the userId param
  app.param('userId', users.user);

    // Answer Routes
  const answers = require('../app/controllers/answers');
  app.get('/answers', answers.all);
  app.get('/answers/:answerId', answers.show);
    // Finish with setting up the answerId param
  app.param('answerId', answers.answer);

    // Question Routes
  const questions = require('../app/controllers/questions');
  app.get('/questions', questions.all);
  app.get('/questions/:questionId', questions.show);
    // Finish with setting up the questionId param
  app.param('questionId', questions.question);

    // Avatar Routes
  const avatars = require('../app/controllers/avatars');
  app.get('/avatars', avatars.allJSON);

  // API routes for user search
  app.get('/api/search/users/:inviteeSearch?', users.findUsers);

  app.post('/api/invite/user', users.sendInvite);

  // api end point for game gameRecords
  app.post('/api/games/:id/start', users.gameRecords);

  // api end point for view game history
  app.get('/api/games/history', users.gameHistory);

  // api endpoint for game wins
  app.get('/api/leaderboard', users.leaderBoard);
  // api endpoint for donations
  app.get('/api/donations', users.donations);

  // api endpoint for friends
  app.post('/api/addfriend', users.addFriend);
  app.post('/api/removefriend', users.removeFriend);

  // Home route
  const index = require('../app/controllers/index');
  app.get('/play', index.play);
  app.get('/', index.render);
  // api end point for view game history

  // api endpoint to mark tour takers
  app.post('/api/tooktour', users.tookTour);
};

