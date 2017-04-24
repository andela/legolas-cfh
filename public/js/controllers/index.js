angular.module('mean.system')
.controller('IndexController', ['$scope', '$location', '$window', '$http', 'Global', 'socket', 'game', 'AvatarService', function ($scope, $location, $window, $http, Global, socket, game, AvatarService) {
  $scope.global = Global;
<<<<<<< HEAD

  $scope.playAsGuest = function () {
=======
  $scope.global.signupErr = "";

  $scope.playAsGuest = function() {
>>>>>>> 2ea475ce558843f7c8ef6a3cdfa08d4a28b398de
    game.joinGame();
    $location.path('/app');
  };

<<<<<<< HEAD
  $scope.showError = function () {
    if ($location.search().error) {
      return $location.search().error;
    }
    return false;
=======
  $scope.showError = function() {
    if ($location.search().error) {
      return $location.search().error;
    } else {
      return false;
    }
>>>>>>> 2ea475ce558843f7c8ef6a3cdfa08d4a28b398de
  };

  $scope.avatars = [];
  AvatarService.getAvatars()
<<<<<<< HEAD
      .then((data) => {
        $scope.avatars = data;
=======
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
>>>>>>> 2ea475ce558843f7c8ef6a3cdfa08d4a28b398de
      });
    } // if else
  };

  $scope.signout = () => {
    $window.localStorage.removeItem('token');
  };

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
    $http.post('/api/auth/login', user).then((response) => {
      if (response.data.success) {
        $window.localStorage.setItem('token', response.data.token);
        $location.path('/');
      } else {
        $scope.showError = () => 'invalid';
      }
    }, (err) => {
      $scope.showError();
      $scope.error = err;
    });
  };
}]);
