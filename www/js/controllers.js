angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Oauth Login
  $scope.authenticate = function(platform){
    console.log("we about to authenticate!!!")
  };

  // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);

  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };
})

.controller('NewMessageCtrl', function($scope, $http) {
  $scope.message = {};

  $scope.scheduleMessage = function(message){
    console.log(message);
    var data = {
      number: message.contact
    };
  debugger
    // post route to backend
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/users/1/send_verification_code',
      data: data
    }

    $http(req)
      .success(function(response){console.log(response)})
      .error(function(response){console.log(response)});
  }
})
