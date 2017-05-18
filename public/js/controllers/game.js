angular.module('mean.system')
// MOVED THE FUNCTION TO A NEW LINE.
// ADD SOME $SCOPE VARIABLES
.controller('GameController', ['$scope', '$rootScope', 'game', 'region', '$http', '$timeout', '$location', 'MakeAWishFactsService', '$dialog',
  ($scope, $rootScope, game, region, $http, $timeout, $location, MakeAWishFactsService, $dialog) => {
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $scope.pickedCards = [];
    let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();
    $scope.showFindUsersButton = false;
    $scope.inviteeSearch = '';
    $scope.invitedUsersList = [];
    $scope.region = region;
    $scope.startNewGame = false;

    if (localStorage.getItem('cfh-user')) {
      window.user = JSON.parse(localStorage.getItem('cfh-user'));
    }

    $scope.pickCard = (card) => {
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            // delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        } else {
          $scope.pickedCards.pop();
        }
      }
    };

    $scope.pointerCursorStyle = () => {
      if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
        return { cursor: 'pointer' };
      }
      return {};
    };

    $scope.sendPickedCards = () => {
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = (card) => {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      }
      return false;
    };

    $scope.cardIsSecondSelected = (card) => {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      }
      return false;
    };

    $scope.firstAnswer = ($index) => {
      if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.secondAnswer = ($index) => {
      if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.showFirst = card =>
      game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;

    $scope.showSecond = card =>
      game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;

    $scope.isCzar = () =>
      game.czar === game.playerIndex;

    $scope.isPlayer = $index =>
      $index === game.playerIndex;

    $scope.isCustomGame = () => {
      if (game.players.length < 3) {
        // Game needs at least three players
      }
      return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
    };

    $scope.isPremium = $index =>
      game.players[$index].premium;

    $scope.currentCzar = $index =>
      $index === game.czar;

    $scope.winningColor = ($index) => {
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      } else {
        return '#f9f9f9';
      }
    };

    $scope.pickWinning = (winningSet) => {
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.winnerPicked = () =>
      game.winningCard !== -1;

    $scope.startGame = () => {
      //  ALLOW START GAME ONLY WHEN THE MIN AND MAX PLAYER NUMBERS ARE TRUE
      //  ELSE DISPLAY A POPUP ERROR MESSAGE
      if (game.players.length < game.playerMinLimit) {
        $rootScope.alertMessage = 'The game requires a minimum of 3 players to be played!';
        $('#game-alert').modal('show');
      } else {
        $scope.showFindUsersButton = false;
        angular.element('#regionModal').modal('show');
        console.log('The regions are ', region.regions);
      }

      // if (game.players.length >= game.playerMinLimit && game.players.length < game.playerMaxLimit) {
      //   if (!$scope.startNewGame) {
      //     $('#newGameModal').modal('show');
      //   } else {
      //     game.startGame();
      //   }
      //   $scope.showFindUsersButton = false;
      // } else if (game.players.length < game.playerMinLimit) {
      //   $rootScope.alertMessage = 'The game requires a minimum of 3 players to be played!';
      //   $('#game-alert').modal('show');
      // }
    };

    $scope.abandonGame = () => {
      game.leaveGame();
      $location.path('/');
    };

    $scope.getValidId = str => (str.replace(/[^\w-]/g, '-'));

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', () => {
      $scope.hasPickedCards = false;
      $scope.showTable = false;
      $scope.winningCardPicked = false;
      $scope.makeAWishFact = makeAWishFacts.pop();
      if (!makeAWishFacts.length) {
        makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      }
      $scope.pickedCards = [];
    });

    // In case player doesn't pick a card in time, show the table
    $scope.$watch('game.state', () => {
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
      if ($scope.isCzar() && game.state === 'czar pick card' && game.table.length === 0) {
        $('#cardModal').modal('show');
      }
      if (game.state === 'game dissolved') {
        $('#cardModal').modal('hide');
      }
      if ($scope.isCzar() === false && game.state === 'czar pick card'
        && game.state !== 'game dissolved'
        && game.state !== 'awaiting players' && game.table.length === 0) {
        $scope.czarHasDrawn = 'Wait! Czar is drawing Card';
      }
      if (game.state !== 'czar pick card'
        && game.state !== 'awaiting players'
        && game.state !== 'game dissolve') {
        $scope.czarHasDrawn = '';
      }
    });

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

    $scope.shuffleCards = () => {
      // $('#cardModal').modal('show');
      const card = $('#card');
      card.addClass('animated flipOutX');
      $timeout(() => {
        // console.log('move to $scope.startNextRound()');
        $scope.startNextRound();
        card.removeClass('animated flipOutX');
        $('#closeModal').click();
      }, 500);
    };

    $scope.startNextRound = () => {
      // console.log('startNextRound() should start the game');
      if ($scope.isCzar()) {
        game.startNextRound();
      }
    };

      if ($scope.game.playerIndex === 0) {
        region.getSelectedRegion().then((selectedRegion) => {
          $scope.selectedRegion = selectedRegion;
        });
      }

    $scope.beginGame = () => {
      game.setRegion($scope.selectedRegion).then(() => {
        game.startGame();
        console.log(`selected region is ${$scope.selectedRegion}`);
      });
      angular.element('#regionModal').modal('hide');
    };

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
