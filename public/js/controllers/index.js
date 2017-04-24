angular.module('mean.system')
.controller('IndexController', ['$scope', '$location', '$window', '$http', 'Global', 'socket', 'game', 'AvatarService', function ($scope, $location, $window, $http, Global, socket, game, AvatarService) {
  $scope.global = Global;
  $scope.global.signupErr = "";

  $scope.playAsGuest = function() {
    game.joinGame();
    $location.path('/app');
  };

  $scope.showError = function() {
    if ($location.search().error) {
      return $location.search().error;
    } else {
      return false;
    }
  };

  $scope.avatars = [];
  AvatarService.getAvatars()
    .then(function(data) {
      $scope.avatars = data;
    });

  if ($window.localStorage.getItem('token')) {
    $scope.global.authenticated = true;
  } else {
    $scope.global.authenticated = false;
  }

  $scope.signup = () => {
    if (!$scope.email || !$scope.password){
      const error = { message: 'Enter your username and password' };
      $scope.showError();
      $scope.error = error;
    } else {
      const signupUser = {
        email: $scope.email,
        password: $scope.password,
        name: $scope.name,
        avatar: $scope.avatars.avatar
      };

      // call the api
      $http.post('/api/auth/signup', signupUser).then((res) => {
        if (res.data.success) {
          $window.localStorage.setItem('token', res.data.token);
          $scope.showOptions = false;
          $location.path('/');
        } else {
          $scope.signupErr = 'Cannot be authenticated';
          $scope.showError();
        }
      }, (err) => {
        $scope.signupErr = err.data.message;
        $scope.showError();
      });
    } // if else
  };

  $scope.signout = () => {
    $window.localStorage.removeItem('token');
  };

}]);