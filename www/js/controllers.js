angular.module('starter.controllers', ['ng-token-auth'])

.config(function($authProvider) {
  $authProvider.configure({
    apiUrl: 'http://localhost:3000' //your api's url
  });
})

.controller('AppCtrl', function($scope, $ionicModal, $auth) {
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
  $scope.showLogin = function() {
    $scope.modal.show();
  };

  //OAUTH SIGN IN
  $scope.login = function() {
    $auth.authenticate('google')
    .then(function(resp) {
      $scope.user = resp;
      // if (resp.phone_number) {
      $scope.activeSession = true;
      // } else {
        // display the page/modal where they enter their phonenumber
        // on that modal, have a button that hits the send_verification_code route
        // then next modal, have a button that hits the verify_code route
        // then the backend needs to save the phone number as valid, ELSE this modal redisplays with errors
      // }
    })
    .catch(function(resp) {
      console.log("error")
    });
  };


  // //OAUTH SIGN OUT
  $scope.logout= function() {
    $auth.signOut()
    .then(function(resp) {
      $scope.activeSession = false;
      console.log("WUNDABAR!!!")
    })
    .catch(function(resp) {
      console.log("SOMETHING TERRIBLE HAS HAPPENED")
    });
  };
})

.controller('NewMessageCtrl', function($scope, $http) {
  $scope.message = {};

  $scope.scheduleMessage = function(message){
    console.log(message);
    var data = {
      number: message.contact
    };
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
