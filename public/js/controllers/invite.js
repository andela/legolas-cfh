angular.module('mean.system')
// MOVED THE FUNCTION TO A NEW LINE.
// ADD SOME $SCOPE VARIABLES
.controller('InviteController', ['$scope', 'game', '$http', '$location', 'Global', 'socket',
  ($scope, game, $http, $location, Global, socket) => {
    $scope.game = game;
    $scope.showFindUsersButton = false;
    $scope.inviteeSearch = '';
    $scope.invitedUsersList = [];
    // $scope.region = region;
    // $scope.startNewGame = false;

    $scope.$watch('game.gameID', () => {
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({ game: game.gameID });
          if (!$scope.modalShown) {
            setTimeout(() => {
              const link = document.URL;
              const txt = 'Give the following link to your friends so they can join your game: ';
              $('#lobby-how-to-play').text(txt);
              $('#oh-el').css({ textAlign: 'center', fontSize: '22px', background: 'white', color: 'black' }).text(link);
            }, 200);
            $scope.modalShown = true;
          }
        }
      }
    });

    // FIND USERS
    $scope.findUserPopup = () => {
      $('#findUser').modal('show');
    };

    $scope.addFriend = (friend) => {
      // add an array to the db. holds the list of friends user-id
      const data = {
        myId: window.user._id,
        friendEmail: friend.email,
        friendName: friend.name,
        friendId: friend._id
      };
      $http.post('/api/addfriend', data)
      .then((res) => {
        console.log('Response', res);
        window.user = res.data;
        localStorage.setItem('cfh-user', JSON.stringify(window.user));
      }, (err) => {
        console.log('Error', err);
      });
    };

    $scope.removeFriend = (friend) => {
      const data = {
        myId: window.user._id,
        friendId: friend._id
      };
      $http.post('/api/removefriend', data)
      .then((res) => {
        console.log('Response', res);
        window.user = res.data;
        localStorage.setItem('cfh-user', JSON.stringify(window.user));
      }, (err) => {
        console.log('Error', err);
      });
    };

    $scope.findUsers = () => {
      $http.get(`/api/search/users/${$scope.inviteeSearch}`)
        .then((response) => {
          if (response.data.length > 0) {
            $scope.searchResult = response.data;
            $scope.noUser = false;
            console.log('$scope.searchResult', response.data);
          } else {
            $scope.searchResult = [];
            $scope.noUser = 'No such user found';
            // console.log('No such user found');
          }
        }, (data, status, headers, config) => {
          // console.log(status);
        });
    };
    // console.log('search result scope', $scope.searchResult);

    $scope.inAppInvite = (user) => {
      console.log('in app notification', user);
      $(`#inApp${$scope.getValidId(user.email)}`).prop('disabled', true);
      $(`#inApp${$scope.getValidId(user.email)}`).html('Sending...');

      socket.emit(
        'inAppInvite',
        {
          inviteeEmail: user.email,
          invite: {
            gameUrl: document.URL,
            gameOwner: window.user.name || 'Guest'
          }
        },
        (res) => {
          if (res.success) {
            console.log('User is online. message sent');
            if (!$scope.inviteStatus) {
              $scope.inviteStatus = {};
            }
            // $('.invite-sent').html(`${$('.invite-sent').html()}Invite sent to ${User.getFriends()[friendEmail]}!<br>`);
            $scope.inviteStatus[user.email] = { message: `App invite successfully sent to ${user.name}!` };
            $scope.invitedUsersList.push(`${user.name}, ${user.email}`);
          } else {
            game.emailInvite({
              gameUrl: document.URL,
              inviteeEmail: user.email,
              gameOwner: window.user.name || 'Guest'
            }).then((successMessage) => {
              console.log('success message', successMessage);
              if (!$scope.inviteStatus) {
                $scope.inviteStatus = {};
              }
              $scope.inviteStatus[user.email] = { message: `Email successfully sent to ${user.name}!` };
              $scope.invitedUsersList.push(`${user.name}, ${user.email}`);
            }, (errorMessage) => {
              $scope.inviteStatus[user.email] = 'Could not send invite';
              console.log('error sent to game.js', errorMessage);
              $(`#send${$scope.getValidId(user.email)}`).prop('disabled', false);
              $(`#send${$scope.getValidId(user.email)}`).html('Send Invite');
            });
          }
        }
      );
    };

    $scope.sendInvite = (user) => {
      if (!$scope.hasBeenInvited(`${user.name}, ${user.email}`)) {
        $(`#send${$scope.getValidId(user.email)}`).prop('disabled', true);
        $(`#send${$scope.getValidId(user.email)}`).html('Sending...');
        const data = {
          url: document.URL,
          inviteeEmail: user.email,
          gameOwner: game.players[0].username
        };
        // console.log(data);
        $http({
          method: 'POST',
          url: '/api/invite/user',
          headers: { 'Content-Type': 'application/json' },
          data
        })
        .success((response) => {
          if (!$scope.inviteStatus) {
            $scope.inviteStatus = {};
          }
          $scope.inviteStatus[user.email] = { message: `Email successfully sent to ${user.name}!` };
          $scope.invitedUsersList.push(`${user.name}, ${user.email}`);
          // console.log('this.data', response);
          // console.log('$scope.invitedUsersList', $scope.invitedUsersList);
        })
        .error((error) => {
          $scope.inviteStatus[user.email] = 'Could not send invite';
          console.log('error sent to game.js', error);
          $(`#send${$scope.getValidId(user.email)}`).prop('disabled', false);
          $(`#send${$scope.getValidId(user.email)}`).html('Send Invite');
        });
      }
    };

    $scope.getValidId = str => (str.replace(/[^\w-]/g, '-'));

    $scope.hasBeenInvited = nameAndEmail => ($scope.invitedUsersList.includes(nameAndEmail));

    $scope.isFriend = user => (window.user.friends && window.user.friends[user._id]);

    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      // console.log('joining custom game');
      game.joinGame('joinGame', $location.search().game);
    } else if ($location.search().custom) {
      game.joinGame('joinGame', null, true);
    } else {
      game.joinGame();
    }
  }
]);
