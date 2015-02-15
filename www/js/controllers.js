angular.module('starter.controllers', ['ng-token-auth'])

.config(function($authProvider) {
  $authProvider.configure({
    apiUrl: 'http://localhost:3000' //your api's url
  });
})

.controller('AppCtrl', function($scope, $ionicModal, $auth) {
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
      window.localStorage['activeSession'] = true;

    })
    .catch(function(resp) {
      console.log("error")
    });
  };

  $scope.activeSession = function(){
    return window.localStorage['activeSession'] === "true";
  }

      // if (resp.phone_number) {
        // has phonenumber
      // } else {
        // display the page/modal where they enter their phonenumber
        // on that modal, have a button that hits the send_verification_code route
        // then next modal, have a button that hits the verify_code route
        // then the backend needs to save the phone number as valid, ELSE this modal redisplays with errors
      // }


  // //OAUTH SIGN OUT
  $scope.logout= function() {
    $auth.signOut()
    .then(function(resp) {
      window.localStorage['activeSession'] = false;
      console.log("WUNDABAR!!!")
    })
    .catch(function(resp) {
      console.log("SOMETHING TERRIBLE HAS HAPPENED")
    });
  };
})


.controller('SendVerificationCodeCtrl', function($scope, $http) {
  $scope.message = {};

  $scope.sendVerificationCode = function(message){
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

.controller('VerifyCodeCtrl', function($scope, $http) {
  $scope.message = {};

  $scope.sendVerificationCode = function(message){
    console.log(message);
    var data = {
      number: message.contact
    };
  // debugger
    // post route to backend
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/users/1/verify_code',
      data: data
    }

    $http(req)
      .success(function(response){console.log(response)})
      .error(function(response){console.log(response)});
  }
})



// post new message
.controller('NewMessageCtrl', function($scope, $http) {
  $scope.message = {};

  $scope.scheduleMessage = function(message){
    console.log(message);
    var data = {
      number: message.contact,
      body: message.content
    };
  // debugger
    // post route to backend
    var req = {
      method: 'POST',
      // url: 'http://localhost:3000/users/1/send_verification_code',
      url: 'http://localhost:3000/users/1/messages',
      data: data
    }

    $http(req)
      .success(function(response){console.log(response)})
      .error(function(response){console.log(response)});
  }
})

.controller('LoginCtrl', function($scope, $auth, $state) {
  var skip = function() {
    $state.go('app/new_message')
  }
  console.log($scope)
  console.log("active session: " + $scope.activeSession)
  // skip()
})
