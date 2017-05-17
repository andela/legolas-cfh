angular.module('mean.system')
// MOVED THE FUNCTION TO A NEW LINE.
// ADD SOME $SCOPE VARIABLES
.controller('InviteController', ['$scope', '$rootScope', 'game', '$http', '$timeout', '$location',
  ($scope, $rootScope, game, $http, $timeout, $location) => {
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $scope.showFindUsersButton = false;
    $scope.inviteeSearch = '';
    $scope.invitedUsersList = [];

    $scope.isCustomGame = () => {
      if (game.players.length < 3) {
        // Game needs at least three players
      }
      return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
    };

    // $scope.getValidId = str => (str.replace(/[^\w-]/g, '-'));

    // FIND USERS
    $scope.findUserPopup = () => {
      $('#findUser').modal('show');
      console.log('Find user called');
    };

    $scope.findUsers = () => {
      $http.get(`/api/search/users/${$scope.inviteeSearch}`)
        .then((response) => {
          if (response.data.length > 0) {
            $scope.searchResult = response.data;
            $scope.noUser = false;
          } else {
            $scope.searchResult = [];
            $scope.noUser = 'No such user found';
            // console.log('No such user found');
          }
        }, (data, status, headers, config) => {
          // console.log(status);
        });
    };

    $scope.sendInvite = (user) => {
      if (!$scope.hasBeenInvited(`${user.name}, ${user.email}`)) {
        $(`#${$scope.getValidId(user.email)}`).prop('disabled', true);
        $(`#${$scope.getValidId(user.email)}`).html('Sending...');
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
          $scope.inviteStatus[user.email] = { message: `Invite successfully sent to ${user.name}!` };
          $scope.invitedUsersList.push(`${user.name}, ${user.email}`);
          // console.log('this.data', response);
          // console.log('$scope.invitedUsersList', $scope.invitedUsersList);
        })
        .error((error) => {
          $scope.inviteStatus[user.email] = 'Could not send invite';
          console.log('error sent to game.js', error);
          $(`#${$scope.getValidId(user.email)}`).prop('disabled', false);
          $(`#${$scope.getValidId(user.email)}`).html('Send Invite');
        });
      }
    };

    $scope.hasBeenInvited = nameAndEmail => ($scope.invitedUsersList.includes(nameAndEmail));
  }
]);
