require('dotenv').config({ silent: true });
/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const nodemailer = require('nodemailer');
const avatars = require('./avatars').all();

const secretKey = process.env.SECRET_KEY;

const gameRecord = require('../models/gameRecord.js');

/**
 * Auth callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/chooseavatars');
};

/**
 * Show login form
 */
exports.signin = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Show sign up form
 */
exports.signup = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Logout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Session
 */
exports.session = function (req, res) {
  res.redirect('/');
};

/**
 * Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 */
exports.checkAvatar = function (req, res) {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
    .exec((err, user) => {
      if (user.avatar !== undefined) {
        res.redirect('/#!/');
      } else {
        res.redirect('/#!/choose-avatar');
      }
    });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/');
  }
};

/**
 * Create user
 */
exports.create = function (req, res) {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    }).exec((err, existingUser) => {
      if (!existingUser) {
        const user = new User(req.body);
        // Switch the user's avatar index to an actual avatar url
        user.avatar = avatars[user.avatar];
        user.provider = 'local';
        user.save((err) => {
          if (err) {
            return res.render('/#!/signup?error=unknown', {
              errors: err.errors,
              user
            });
          }
          req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/#!/');
          });
        });
      } else {
        return res.redirect('/#!/signup?error=existinguser');
      }
    });
  } else {
    return res.redirect('/#!/signup?error=incomplete');
  }
};
/**
 * GET LIST OF CURRENT USERS FROM THE DATABASE BASED ON NAME PARAMS
 * RETURN JSON OBJECT OF USERS
 */
exports.sendInvite = (req, res) => {
  const gameLink = req.body.url;
  const inviteeEmail = req.body.inviteeEmail;
  const sender = req.body.gameOwner;
  const link = `${gameLink}&email=${inviteeEmail}`;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'andelalegolas@gmail.com',
      pass: 'andelalegolas1'
    },
    debug: true
  });

  const mailOptions = {
    from: '"Andela Legolas 👻" <andelalegolas@gmail.com>',
    to: inviteeEmail,
    subject: 'Invitation to join Game',
    html: `<h3> Cards for Humanity </h3><br/>
    You have been invited by <a>${sender}</a> to join a game in cards for humanity<br/>
    click on this link <a href="${link}">here</a> OR <a href="${gameLink}">this</a> to join the game now.<br/>
    <strong>Cards For Humanity</strong>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json({ message: 'Email sent successfully' });
  });
};
exports.findUsers = (req, res) => {
  const query = req.params.inviteeSearch || '';
  User.find({ name: new RegExp(query, 'i') }).limit(10)
    .exec((err, result) => {
      if (err) {
        return res.json(err);
      }
      res.json(result);
    });
};

/**
 * Create user API
 */
exports.createAPI = (req, res) => {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    }).exec((err, existingUser) => {
      if (!existingUser) {
        const user = new User(req.body);
        // Switch the user's avatar index to an actual avatar url
        user.avatar = avatars[user.avatar];
        user.provider = 'local';
        user.save((err) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Signup Error' });
          }
          req.logIn(user, (err) => {
            if (err) {
              return res.status(500).json({ success: false, message: 'Login Error' });
            }
              // Login is successful, set the token
            const token = jwt.sign({
              id: user.id
            }, secretKey);
            return res.status(200).json({ success: true, message: 'Signup successful', token, user });
          });
        });
      } else {
        return res.status(401).json({ success: false, message: 'User exists' });
      }
    });
  } else {
    return res.status(401).json({ success: false, message: 'Wrong Data' });
  }
};


/**
 * Assign avatar to user
 */
exports.avatars = function (req, res) {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
    .exec((err, user) => {
      user.avatar = avatars[req.body.avatar];
      user.save();
    });
  }
  return res.redirect('/#!/app');
};

exports.addDonation = function (req, res) {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
      .exec((err, user) => {
        // Confirm that this object hasn't already been entered
        let duplicate = false;
        for (let i = 0; i < user.donations.length; i++) {
          if (user.donations[i].crowdrise_donation_id === req.body.crowdrise_donation_id) {
            duplicate = true;
          }
        }
        if (!duplicate) {
          console.log('Validated donation');
          user.donations.push(req.body);
          user.premium = 1;
          user.save();
        }
      });
    }
  }
  res.send();
};

/**
 *  Show profile
 */
exports.show = function (req, res) {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next(new Error(`Failed to load User ${id}`));
      req.profile = user;
      next();
    });
};

exports.Signin = (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if (err) throw err;
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      } else {
        console.log(user);
        const validPassword = user.authenticate(req.body.password);
        if (!validPassword) {
          res.status(401).json({ success: false, message: 'Invalid username or password' });
        } else {
          req.logIn(user, (err) => {
            if (err) throw err;
          });
          const token = jwt.sign(user, secretKey);
          res.status(200).json({ success: true, message: 'Signin successful', token, user });
        }
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'No email or password entered' });
  }
};
// store game infomation in DATABASE
exports.gameRecords = (req, res) => {
  const gameOwner = req.body.gameOwner;
  const gamePlayDate = req.body.gamePlayDate;
  const gameRounds = req.body.gameRounds;
  const gameWinner = req.body.gameWinner;
  const gamePlayers = req.body.gamePlayers;
  const gameID = req.params.id;

  const record = new gameRecord({
    gameOwner,
    gamePlayDate,
    gameID,
    gamePlayers,
    gameRounds,
    gameWinner
  });
  record.save((err, savedObject) => {
    if (err) {
      console.log(err);
      res.status(500).send('an error occured');
    } else {
      console.log(savedObject);
      // res.status(200).send(`game record saved successfully ${savedObject}`);
    }
  });
  User.findOneAndUpdate({ name: gameWinner }, { $inc: { gameWins: 1 } })
  .exec((err, update) => {
    if (err) console.log(err);
    if (update) res.send(update);
  });
};
exports.gameHistory = (req, res) => {
  const name = req.query.name;
  gameRecord.find({
    gamePlayers: { $in: [name] }
  }).sort({ $natural: -1 }).exec((err, records) => {
    if (err) console.log(err);
    if (records) res.status(200).send(records);
  });
};

exports.leaderBoard = (req, res) => {
 // res.send('succes  : true')
  User.find({})
.sort({ gameWins: -1 })
.limit(20)
.exec((err, records) => {
  res.send(records);
});
};

exports.addFriend = (req, res) => {
  User
  .findOne({ _id: req.body.myId })
  .exec((err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      if (!user.friends) user.friends = {};
      user.friends[req.body.friendId] = {
        name: req.body.friendName,
        email: req.body.friendEmail
      };
      User.findByIdAndUpdate(
        user._id,
        { $set: { friends: user.friends } },
        { new: true },
        (err, updatedUser) => {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          } else {
            res.status(200).json(updatedUser);
          }
        }
      );
    }
  });
};

exports.removeFriend = (req, res) => {
  User
  .findOne({ _id: req.body.myId })
  .exec((err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      if (!user.friends) user.friends = {};
      delete user.friends[req.body.friendId];
      User.findByIdAndUpdate(
        user._id,
        { $set: { friends: user.friends } },
        { new: true },
        (err, updatedUser) => {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          } else {
            res.status(200).json(updatedUser);
          }
        }
      );
    }
  });
};

exports.tookTour = (req, res) => {
  User.findByIdAndUpdate(
    req.body.id,
    { $set: { isNewUser: false } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      if (!updatedUser) {
        return res.status(404).send({
          message: 'User does not exist'
        });
      }
      res.status(200).json(updatedUser);
    }
  );
};

exports.donations = (req, res) => {
  const name = req.query.name;
  User.findOne({ name }).exec((err, object) => {
    if (err) {
      console.log(err);
    } else {
      const donation = object.donations;
      res.send(donation);
    }
  });
};
