angular.module('starter.controllers', ['ng-token-auth'])

.config(function($authProvider) {
  $authProvider.configure({
    apiUrl: 'http://localhost:3000' //your api's url
  });
})

.controller('AppCtrl', function($scope, $ionicModal, $auth, $state) {
  // OAUTH SIGN OUT
  $scope.logout = function() {
    $auth.signOut()
    .then(function(resp) {
      window.localStorage.clear();
      console.log("WUNDABAR!!!");
      $state.go('login');
    })
    .catch(function(resp) {
      console.log("SOMETHING TERRIBLE HAS HAPPENED in the AppCtrl")
    });
  }

      // if (resp.phone_number) {
        // has phonenumber
      // } else {
        // display the page/modal where they enter their phonenumber
        // on that modal, have a button that hits the send_verification_code route
        // then next modal, have a button that hits the verify_code route
        // then the backend needs to save the phone number as valid, ELSE this modal redisplays with errors
      // }
  // };
})


.controller('EnterUserPhoneCtrl', function($scope, $http, $state) {
  $scope.message = {};

  $scope.sendVerificationCode = function(message){
    console.log(message);
    var data = {
      number: message.contact
    };
    var userId = window.localStorage['user_id']
    // post route to backend
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/users/'+userId+'/send_verification_code',
      data: data
    }

    $http(req)
    .success(function(response){
      console.log(response)
      $state.go('app.verify_code')
    })
    .error(function(response){console.log(response)});
  }
})

.controller('VerifyCodeCtrl', function($scope, $http, $state) {
  $scope.verifyCode = function(verificationCode){
    console.log(verificationCode);
    var data = {
      number: verificationCode
    };
    var userId = window.localStorage['user_id']
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/users/'+userId+'/verify_code',
      data: data
    }
    // make sure backend returns a JSON with verification state
    // handle state from there.
    $http(req)
      .success(function(response){
          window.localStorage['phone_verified'] = response.phone_verified;
        $state.go('app.new_message');
      })
      .error(function(response){console.log(response)});
  }
})



// post new message
.controller('NewMessageCtrl', function($scope, $http, $state) {

  if (window.localStorage['activeSession'] !== "true"){
    $state.go('login');
  }
  $scope.message = {};

  $scope.scheduleMessage = function(message){
    console.log(message);
    var data = {
      number: message.contact,
      body: message.content,
      send_at_datetime: message.date
    };
    var userId = localStorage.user_id
  debugger
    // post route to backend
    var req = {
      method: 'POST',
      // url: 'http://localhost:3000/users/1/send_verification_code',
      url: 'http://localhost:3000/users/'+userId+'/messages',
      data: data
    }

    $http(req)
      .success(function(response){console.log(response)})
      .error(function(response){console.log(response)});
  }
})

.controller('LoginCtrl', function($scope, $auth, $state) {
  //OAUTH SIGN IN
  // later, consider changing this to phone_verified
  if (window.localStorage['activeSession'] === "true"){
    $state.go('app.new_message');
  }
  $scope.login = function() {
    $auth.authenticate('google')
    .then(function(resp) {
      window.localStorage['user_id'] = resp.id;
      window.localStorage['user_name'] = resp.name;
      window.localStorage['phone_verified'] = resp.phone_verified;
      window.localStorage['activeSession'] = true;
      if (window.localStorage.phone_verified === "false") {
        console.log("need to verify #")
        $state.go('app.enter_user_phone');
      } else if (window.localStorage.phone_verified === "true") {
        $state.go('app.new_message');
      };
    })
    .catch(function(resp) {
      console.log("error")
    });
  };

  $scope.activeSession = function(){
    return window.localStorage['activeSession'] === "true";
  }

  // //OAUTH SIGN OUT
  // $scope.logout= function() {
  //   $auth.signOut()
  //   .then(function(resp) {
  //     window.localStorage.clear();
  //     console.log("WUNDABAR!!!")
  //   })
  //   .catch(function(resp) {
  //     console.log("SOMETHING TERRIBLE HAS HAPPENED")
  //   });
  // }
  // skip()
})
