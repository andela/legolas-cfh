const firebase = require('firebase');

const Game = require('./game');
const Player = require('./player');
require('console-stamp')(console, 'm/dd HH:MM:ss');
const mongoose = require('mongoose');
let User = mongoose.model('User');

let avatars = require('../../app/controllers/avatars').all();
// Valid characters to use to generate random private game IDs
let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

const config = {
  apiKey: 'AIzaSyD75FP943k1T61k1mA0TYctQ8aIAhdW5eY',
  authDomain: 'cards-for-humanity-b1f0c.firebaseapp.com',
  databaseURL: 'https://cards-for-humanity-b1f0c.firebaseio.com',
  projectId: 'cards-for-humanity-b1f0c',
  storageBucket: 'cards-for-humanity-b1f0c.appspot.com',
  messagingSenderId: '443652256544'
};
firebase.initializeApp(config);
const database = firebase.database();

module.exports = (io) => {
  let game;
  let chatMessages = [];
  let allGames = {};
  let allPlayers = {};
  let gamesNeedingPlayers = [];
  let gameID = 0;
  const onlineSockets = {};
  const onlineUsers = {};
  const invites = {};

  io.sockets.on('connection', (socket) => {
    console.log(`${socket.id   } Connected`);
    socket.emit('id', { id: socket.id });

    // initialize online users once a connection is made
    socket.emit('onlineUsers', onlineUsers);
  
    // initialize chat when a new socket is connected
    socket.emit('initializeChat', chatMessages);

    // send recieved chat message to all connected sockets
    socket.on('chat message', (chat) => {
      game = allGames[socket.gameID];
      //console.log('gamessssss', game);
      game.players.forEach(player => player.socket.emit('chat message', chat));
      chatMessages.push(chat);
      database.ref(`chat/${gameID}`).set(chatMessages);
    });


    socket.on('pickCards', (data) => {
      console.log(socket.id, 'picked', data);
      if (allGames[socket.gameID]) {
        allGames[socket.gameID].pickCards(data.cards, socket.id);
      } else {
        console.log('Received pickCard from', socket.id, 'but game does not appear to exist!');
      }
    });

    socket.on('pickWinning', (data) => {
      if (allGames[socket.gameID]) {
        allGames[socket.gameID].pickWinning(data.card, socket.id);
      } else {
        console.log('Received pickWinning from', socket.id, 'but game does not appear to exist!');
      }
    });

    socket.on('joinGame', (data) => {
      if (!allPlayers[socket.id]) {
        joinGame(socket, data);
      }
    });

    socket.on('joinNewGame', (data) => {
      exitGame(socket);
      joinGame(socket, data);
    });

    socket.on('startGame', () => {
      if (allGames[socket.gameID]) {
        const thisGame = allGames[socket.gameID];
        console.log('comparing', thisGame.players[0].socket.id, 'with', socket.id);
        if (thisGame.players.length >= thisGame.playerMinLimit) {
          // Remove this game from gamesNeedingPlayers so new players can't join it.
          gamesNeedingPlayers.forEach((gameSession, index) => {
            if (gameSession.gameID === socket.gameID) {
              return gamesNeedingPlayers.splice(index, 1);
            }
          });
          thisGame.prepareGame();
          thisGame.sendNotification('The game has begun!');
        }
      }
    });

    socket.on('leaveGame', () => {
      exitGame(socket);
    });

    socket.on('disconnect', () => {
      if (onlineSockets[socket.id]) {
        delete onlineUsers[onlineSockets[socket.id].email];
        delete onlineSockets[socket.id];
      }
      exitGame(socket);
    });

    socket.on('czarSelectCard', () => {
      allGames[socket.gameID].startNextRound(allGames[socket.gameID]);
    });

    socket.on('setRegion', (data, fn) => {
      if (allGames[socket.gameID]) {
        const thisGame = allGames[socket.gameID];
        console.log(`Setting region for game ${socket.gameID}`);
        thisGame.setRegion(data.region);
        fn({ success: true });
      }
    });

    socket.on('loggedIn', (data) => {
      onlineSockets[socket.id] = data;
      onlineUsers[data.email] = socket.id;
      console.log('logged in user', data.email, socket.id);
    });

    socket.on('inAppInvite', (data, fn) => {
      const socketId = onlineUsers[data.inviteeEmail];
      if (socketId) {
        if (!invites[data.inviteeEmail]) {
          invites[data.inviteeEmail] = [];
        }
        invites[data.inviteeEmail].unshift(data.invite);
        io.to(socketId).emit('newInvite', invites[data.inviteeEmail]);
        console.log('Invite sent to', data.inviteeEmail, socketId);
        fn({ success: true });
      } else {
        console.log('Invite failed');
        fn({ success: false });
      }
    });

    socket.on('getInvites', (data, fn) => {
      if (invites[data.email]) {
        fn({
          success: true,
          invites: invites[data.email]
        });
      } else {
        fn({ success: false });
      }
    });

    socket.on('acceptedInvite', (data, fn) => {
      if (invites[data.email]) {
        invites[data.email].splice(data.index, 1);
        fn({
          success: true,
          invites: invites[data.email]
        });
      } else {
        fn({ success: false });
      }
    });
  });

  var joinGame = function (socket, data) {
    let player = new Player(socket);
    data = data || {};
    player.userID = data.userID || 'unauthenticated';
    if (data.userID !== 'unauthenticated') {
      User.findOne({
        _id: data.userID
      }).exec((err, user) => {
        if (err) {
          console.log('err', err);
          return err;
        }
        if (!user) {
          // If the user's ID isn't found (rare)
          player.username = 'Guest';
          player.avatar = avatars[Math.floor(Math.random() * 4) + 12];
        } else {
          player.username = user.name;
          player.premium = user.premium || 0;
          player.avatar = user.avatar || avatars[Math.floor(Math.random() * 4) + 12];
        }
        getGame(player, socket, data.room, data.createPrivate);
      });
    } else {

      // IF PLAYER_LENGTH IS GREATER THAN OR EQUAL TO PLAYER_MAX_LIMIT
      // DISPLAY ERROR POPUP
      player.username = 'Guest';
      player.avatar = avatars[Math.floor(Math.random() * 4) + 12];
      getGame(player, socket, data.room, data.createPrivate);
    }
  };

  const getGame = (player, socket, requestedGameId, createPrivate) => {
    requestedGameId = requestedGameId || '';
    createPrivate = createPrivate || false;
    console.log(socket.id, 'is requesting room', requestedGameId);
    if (requestedGameId.length && allGames[requestedGameId]) {
      console.log('Room', requestedGameId, 'is valid');
      const game = allGames[requestedGameId];
      // Ensure that the same socket doesn't try to join the same game
      // This can happen because we rewrite the browser's URL to reflect
      // the new game ID, causing the view to reload.
      // Also checking the number of players, so node doesn't crash when
      // no one is in this custom room.
      if (game.state === 'awaiting players' && (!game.players.length ||
        game.players[0].socket.id !== socket.id)) {
        // Put player into the requested game
        console.log('Allowing player to join', requestedGameId);
        allPlayers[socket.id] = true;
        game.players.push(player);
        socket.join(game.gameID);
        socket.gameID = game.gameID;
        game.assignPlayerColors();
        game.assignGuestNames();
        game.sendUpdate();
        game.sendNotification(`${player.username} has joined this new game!`);
        if (game.players.length >= game.playerMaxLimit) {
          gamesNeedingPlayers.shift();
          game.prepareGame();
        }
      } else {
        // TODO: Send an error message back to this user saying the game has already started
        io.to(player.socket.id).emit('gameStarted', { message: 'This game has already started.' });
      }
    } else {
      // Put players into the general queue
      console.log('Redirecting player', socket.id, 'to general queue');
      if (createPrivate) {
        createGameWithFriends(player, socket);
      } else {
        fireGame(player, socket);
      }
    }
  };

  var fireGame = function (player, socket) {
    let game;
    if (gamesNeedingPlayers.length <= 0) {
      gameID += 1;
      let gameIDStr = gameID.toString();
      game = new Game(gameIDStr, io);
      allPlayers[socket.id] = true;
      game.players.push(player);
      allGames[gameID] = game;
      gamesNeedingPlayers.push(game);
      socket.join(game.gameID);
      socket.gameID = game.gameID;
      console.log(socket.id, 'has joined newly created game', game.gameID);
      game.assignPlayerColors();
      game.assignGuestNames();
      game.sendUpdate();
    } else {
      game = gamesNeedingPlayers[0];
      allPlayers[socket.id] = true;
      game.players.push(player);
      console.log(socket.id, 'has joined game', game.gameID);
      socket.join(game.gameID);
      socket.gameID = game.gameID;
      game.assignPlayerColors();
      game.assignGuestNames();
      game.sendUpdate();
      game.sendNotification(`${player.username} has joined the game!`);
      if (game.players.length >= game.playerMaxLimit) {
        gamesNeedingPlayers.shift();
        game.prepareGame();
      }
    }
  };

  var createGameWithFriends = function (player, socket) {
    let isUniqueRoom = false;
    let uniqueRoom = '';
    // Generate a random 6-character game ID
    while (!isUniqueRoom) {
      uniqueRoom = '';
      for (let i = 0; i < 6; i++) {
        uniqueRoom += chars[Math.floor(Math.random() * chars.length)];
      }
      if (!allGames[uniqueRoom] && !(/^\d+$/).test(uniqueRoom)) {
        isUniqueRoom = true;
      }
    }
    console.log(socket.id, 'has created unique game', uniqueRoom);
    let game = new Game(uniqueRoom, io);
    allPlayers[socket.id] = true;
    game.players.push(player);
    allGames[uniqueRoom] = game;
    socket.join(game.gameID);
    socket.gameID = game.gameID;
    game.assignPlayerColors();
    game.assignGuestNames();
    game.sendUpdate();
  };

  var exitGame = function (socket) {
    console.log(socket.id, 'has disconnected');
    if (allGames[socket.gameID]) { // Make sure game exists
      let game = allGames[socket.gameID];
      console.log(socket.id, 'has left game', game.gameID);
      delete allPlayers[socket.id];
      if (game.state === 'awaiting players' ||
        game.players.length - 1 >= game.playerMinLimit) {
        game.removePlayer(socket.id);
      } else {
        game.stateDissolveGame();
        for (let j = 0; j < game.players.length; j++) {
          game.players[j].socket.leave(socket.gameID);
        }
        game.killGame();
        delete allGames[socket.gameID];
        chatMessages = [];
      }
      if (game.players.length === 1) {
         chatMessages = [];
         game.sendUpdate();
       }
    }
    socket.leave(socket.gameID);
  };
};

