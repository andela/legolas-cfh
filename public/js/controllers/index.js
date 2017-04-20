angular.module('mean.system')
.controller('IndexController', ['$scope', '$location', '$window', '$http', 'Global', 'socket', 'game', 'AvatarService', function ($scope, $location, $window, $http, Global, socket, game, AvatarService) {
  $scope.global = Global;
  $scope.global.signinErr = '';

  $scope.playAsGuest = function () {
    game.joinGame();
    $location.path('/app');
  };

  $scope.showError = function () {
    if ($location.search().error) {
      return $location.search().error;
    }
    return false;
  };

  $scope.avatars = [];
  AvatarService.getAvatars()
      .then((data) => {
        $scope.avatars = data;
      });

  if ($window.localStorage.getItem('token')) {
    $scope.global.authenticated = true;
  } else {
    $scope.global.authenticated = false;
  }

  $scope.signout = () => {
    $window.localStorage.removeItem('token');
    $window.user = null;
  };

  $scope.login = () => {
    const user = {
      email: $scope.email,
      password: $scope.password
    };
    $http.post('/api/auth/Login', user).then((response) => {
      if (response.data.success) {
        $window.localStorage.setItem('token', response.data.token);
        $scope.showOptions = false;
        $location.path('/');
      } else {
        $scope.signinErr = response.data.message;
      }
    }, (err) => {
      $scope.showError();
      $scope.error = err;
    });
  };
}]);
