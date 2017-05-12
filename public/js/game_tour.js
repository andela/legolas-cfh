/* global introJs */
angular.module('mean.system')
  .controller('GameTourController', ['$scope', '$window', function($scope, $window) {
    $scope.$on('$locationChangeSuccess', () => {
      if ($scope.gameTour) {
        $scope.gameTour.exit();
      }
    });

    $scope.gameTour = introJs();
    $scope.playerCount = 1;
    $scope.playerScore = 0;
    $scope.awaitingPlayers = true;
    $scope.gameTour.setOption('showBullets', true);
    $scope.gameTour.setOptions({
      steps: [{
        intro: 'Welcome to Legolas CFH!, To learn how to play, continue with this tutorial '
      },
      {
        element: '#finding-players',
        intro: 'This game needs a minimum of 3 players to start and a max of 12 players!, Get your friends in!'
      },
      {
        element: '#player-container',
        intro: 'You have an icon to identify yourself and other players.'
      },
     
      {
        element: '#invite-player',
        intro: 'Get your friends in here! you can invite as many friends as possible, no limit to the invites!'
      },
      {
        element: '#start-game',
        intro: 'The game can start once there is a minimum of 3 people present. Click the start game button to get started'
      },
      {
        element: '#question',
        intro: 'The czar throws in a card for you to pick an answer you think is suitable!..... No restrictions!'
      },
      {
        element: '#cards',
        intro: 'Feel free, its okay, you can be weird here! Click on one of these cards to answer the questions.',
        position: 'top'
      },
      {
        element: '#inner-timer-container',
        intro: 'Hurry, the game is timed, you need to answer within 20 seconds.'
      },
      {
        element: '#the-czar',
        intro: 'Check the CZAR icon, you might be the next Czar, if you are you will have to pick a question card'
      },
      {
        element: '#inner-text-container',
        intro: 'After a game ends, you can join a new a game or return to Lobby',
        position: 'top'
      },
      {
        element: '#charity-widget-container',
        intro: 'Hey, while you are here, why not contribute to a good cause',
        position: 'top'
      },
      {
        element: '#abandon-game-button',
        intro: 'We do not want to see you go.. but if you have to then you can use this button.',
      },
      {
        element: '#home',
        intro: 'Now you can play, get your friends in here and have fun!',
        position: 'bottom'
      }
      ]
    });

    const isGameCustom = () => {
      const custom = $window.location.href.indexOf('custom') >= 0;
      return (custom);
    };

    const tourComplete = () => {
      if (isGameCustom()) {
        $window.location = '/app?custom';
      } else {
        $window.location = '#!/';
      }
    };

    const beforeTourChange = (targetElement) => {
      switch (targetElement.id) {
        case 'finding-players':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = true;
            });
            break;
          }
        case 'player-container':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = true;
              $scope.showOtherPlayers = true;
              $scope.showStartButton = false;
            });
            break;
          }
        case 'player-score':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = true;
              $scope.showOtherPlayers = true;
              $scope.showStartButton = false;
            });
            break;
          }
        case 'start-game':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = false;
              $scope.showOtherPlayers = true;
              $scope.showStartButton = true;
              $scope.showTime = false;
              $scope.showQuestion = false;
            });
            break;
          }
        case 'invite-player':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = false;
              $scope.showOtherPlayers = true;
              $scope.showStartButton = true;
              $scope.showTime = false;
              $scope.showQuestion = false;
              $scope.showInviteButton = true;
            });
            break;
          }
        case 'question':
          {
            $scope.$apply(() => {
              $scope.showStartButton = false;
              $scope.showTime = true;
              $scope.showQuestion = true;
            });
            break;
          }
        case 'cards':
          {
            $scope.$apply(() => {
              $scope.showCzar = false;
            });
            break;
          }
        case 'time-card':
          {
            $scope.$apply(() => {
              $scope.showQuestion = true;
              $scope.gameEnd = false;
              $scope.playerScore = 0;
            });
            break;
          }
        case 'the-czar':
          {
            $scope.$apply(() => {
              $scope.showCzar = true;
              $scope.playerScore = 1;
            });
            break;
          }
        case 'inner-text-container':
          {
            $scope.$apply(() => {
              $scope.showQuestion = false;
              $scope.gameEnd = true;
              $scope.showChatBody = false;
            });
            break;
          }
        case 'chat':
          {
            $scope.$apply(() => {
              $scope.showChatBody = true;
            });
            break;
          }
        case 'requests':
          {
            $scope.$apply(() => {
              $scope.showChatBody = false;
            });
            break;
          }
        default:
          {
            break;
          }
      }
    };

    $scope.gameTour.start()
      .oncomplete(tourComplete)
      .onexit(tourComplete)
      .onbeforechange(beforeTourChange);
  }]);
