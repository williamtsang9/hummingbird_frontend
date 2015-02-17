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
      console.log("SOMETHING TERRIBLE HAS HAPPENED in the AppCtrl");
    });
  };
})


.controller('EnterUserPhoneCtrl', function($scope, $http, $state) {
  $scope.message = {};

  $scope.sendVerificationCode = function(message){
    console.log(message);
    var data = {
      number: message.contact
    };
    var userId = window.localStorage['user_id'];
    // post route to backend
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/users/'+userId+'/send_verification_code',
      data: data
    };

    $http(req)
    .success(function(response){
      console.log(response);
      $state.go('app.verify_code');
    })
    .error(function(response){
      console.log(response);
    });
  };
})

.controller('VerifyCodeCtrl', function($scope, $http, $state) {
  $scope.verifyCode = function(verificationCode){
    console.log(verificationCode);
    var data = {
      number: verificationCode
    };
    var userId = window.localStorage['user_id'];
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/users/'+userId+'/verify_code',
      data: data
    };
    // make sure backend returns a JSON with verification state
    // handle state from there.
    $http(req)
      .success(function(response){
        if (response.phone_verified === true) {
          $state.go('app.new_message');
        } else {
          $state.go('app.verify_code');
        }
      })
      .error(function(response){
        console.log(response);
      });
  };
})



// post new message
.controller('NewMessageCtrl', function($scope, $http, $state) {

  if (window.localStorage['activeSession'] !== "true"){
    $state.go('login');
  }
  $scope.message = {};
  // var today = new Date();
  // // debugger
  // // console.log(today.setDate(today.getDate() - 1)
  // var yesterday = today.setDate(today.getDate() - 86400)
  // $scope.minDate = yesterday;

  var today = new Date();
  var string = today.toString().split(" ");
  var month = "02"
  var year = string[2]
  var day = string[3]
  var time = string[4];
  var minDate = (year + "-" + month + "-" + day);
  console.log(minDate.toString());
  $scope.minTime = time;
  $scope.minDate = minDate;

  $scope.scheduleMessage = function(message){
    console.log(message);
    var data = {
      number: message.contact,
      body: message.content,
      send_at_datetime: message.date
    };
    var userId = localStorage.user_id;
    // post route to backend
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/users/'+userId+'/messages',
      data: data
    };


    $http(req)
      .success(function(response){
        console.log(response);
        $scope.message = {};
      })
      .error(function(response) {
        console.log(response);
      });
  };
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
      window.localStorage['activeSession'] = true;
      if (resp.phone_verified === "false") {
        $state.go('app.enter_user_phone');
      } else if (resp.phone_verified === "true") {
        $state.go('app.new_message');
      }
    })
    .catch(function(resp) {
      console.log("error");
    });
  };

  $scope.activeSession = function(){
    return window.localStorage['activeSession'] === "true";
  };

});
