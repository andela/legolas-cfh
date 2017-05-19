angular.module('mean.system')
.controller('IndexController', ['$scope', '$location', '$window', '$http', 'Global', 'socket', 'game', 'AvatarService',
function ($scope, $location, $window, $http, Global, socket, game, AvatarService) {
  $scope.global = Global;
  $scope.global.signupErr = "";

  if ($window.localStorage.getItem('cfh-user')) {
    $window.user = JSON.parse($window.localStorage.getItem('cfh-user'));
    socket.emit('getInvites', { email: $window.user.email }, (res) => {
      if (res.success) {
        $scope.invites = res.invites;
      }
    });
  }

  if ($window.user) {
    socket.emit('loggedIn', $window.user);
  }

  $scope.playAsGuest = function () {
    game.joinGame();
    $location.path('/app');
  };

  $scope.showError = function () {
    if ($location.search().error) {
      return $location.search().error;
    } else {
      return false;
    }
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

  $scope.signup = () => {
    if (!$scope.email || !$scope.password) {
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
          console.log(res.data.user);
          $window.user = res.data.user;
          $window.localStorage.setItem('cfh-user', JSON.stringify($window.user));
          $scope.showOptions = false;
          $window.location.href = '/';
        } else {
          $scope.signupErr = 'Cannot be authenticated';
          $scope.showError = () => 'invalid';
        }
      }, (err) => {
        $scope.showError = () => 'invalid';
        $scope.signupErr = err.data.message;
      });
    } // if else
  };

  $scope.signout = () => {
    $window.localStorage.removeItem('token');
    $window.localStorage.removeItem('cfh-user');
    $scope.showOptions = true;
    $scope.global.authenticated = false;
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
        $window.user = response.data.user;
        socket.emit('loggedIn', user);
        // console.log('index.js', socket);
        // console.log(socket.on.Scopes.Global[0].socket, 'has been logged in very recently');
        $window.localStorage.setItem('cfh-user', JSON.stringify($window.user));
        $window.location.href = '/';
      } else {
        $scope.showError = () => 'invalid';
        $scope.loginError = response.data.message;
      }
    }, (err) => {
      $scope.showError = () => 'invalid';
      $scope.loginError = err.data.message;
    });
  };

  socket.on('newInvite', (data) => {
    console.log('Number of invites:', data.length);
    $scope.invites = data;
    // $scope.invites = data;
    // $scope.hasInvites = true;
  });
  // $scope.readInvites = () => {
  //   User.readInvites();
  //   $scope.hasInvites = false;
  // };
  $scope.acceptInvite = (index) => {
    socket.emit(
      'acceptedInvite',
      {
        email: $window.user.email,
        index
      },
      (res) => {
        if (res.success) {
          $scope.invites = res.invites;
        }
      }
    );
  };

  $scope.isNewUser = () => ($window.user && $window.user.isNewUser);
}]);
