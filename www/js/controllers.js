angular.module('starter.controllers', [])

// .config(function($authProvider) {
//   $authProvider.configure({
//     apiUrl: 'http://localhost:3000' //your api's url
//   });
// })

.controller('AppCtrl', function($scope, $ionicModal, $state) {
  // OAUTH SIGN OUT
  // $scope.logout = function() {
  //   $auth.signOut()
  //   .then(function(resp) {
  //     window.localStorage.clear();
  //     console.log("WUNDABAR!!!");
      // $state.go('login');
  //   })
  //   .catch(function(resp) {
  //     console.log("SOMETHING TERRIBLE HAS HAPPENED in the AppCtrl");
  //   });
  // };
  console.log("in $scope.logout")
})


.controller('EnterUserPhoneCtrl', function($scope, $http, $state) {
  $scope.message = {};

  $scope.sendVerificationCode = function(message){
    console.log(message);
    var data = {
      number: message.contact
    };
    // Need new way to set this
    var userId = window.localStorage['user_id'];
    // post route to backend
    console.log("user id" + userId);

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
.controller('NewMessageCtrl', function($scope, $http, $state, $ionicPopup, $timeout) {

  if (window.localStorage['activeSession'] !== "true"){
    $state.go('login');
  }
  $scope.message = {};
// =========================================

var date = new Date();
var dateArray = date.toString().split(" ");
if (dateArray[1] === "Oct" || dateArray[1] === "Nov" || dateArray[1] === "Dec") {
  var month = "-1";
} else {
  var month = "-0";
}
$scope.dateString = dateArray[3] + month + (date.getMonth()+1) + "-" + dateArray[2]

// ============================================

$scope.scheduleMessage = function(message){
  console.log(message);
  var data = {
    number: message.contact,
    body: message.content,
    send_at_datetime: message.date
  };
  var userId = 1;
    // post route to backend
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/users/'+userId+'/messages',
      data: data
    };

    if (data.send_at_datetime < date ) {
     var messageScheduledConfirmation = $ionicPopup.show({
       title: 'That\'s in the past :('
     });
     $timeout(function(){
       messageScheduledConfirmation.close();
     }, 2000);
   } else {
    console.log("making requests");

    $http(req)
    .success(function(response) {
      var messageScheduledConfirmation = $ionicPopup.show({
        title: 'Scheduled!'
      });
      $timeout(function(){
        messageScheduledConfirmation.close();
      }, 2000);
      $scope.message = {};
    })
    .error(function(response) {
      console.log("error message from new message");
    });
  };
}
})

.controller('LoginCtrl', function($scope, $state, $http) {
  //OAUTH SIGN IN
  // later, consider changing this to phone_verified
  // if (window.localStorage['activeSession'] === "true"){
  //   $state.go('app.new_message');
  // }
  $scope.register = function() {
    var inputs = document.getElementsByTagName('input')
    console.log(inputs)
    var email = inputs[0].value
    var password = inputs[1].value
    // These variable names should be revised, because BCrypt
    var data = { email: email, password: password }
    console.log(data)

    // var userId = window.localStorage['user_id'];
    // debugger
    // not sure we need this here since it isn't being passed to create
    // but we need this if we do Users#Login which does /users/:id/login

    request = {
      method: "POST",
      url: 'http://localhost:3000/users', // using Users#Create
      // url: 'http://localhost:3000/users/'+userId+'/register', //using Users#Register
      data: data
      // dataType: 'json'
    };
    console.log(request)

    $http(request)
    .success(function(response) {
      console.log(response);
      debugger;
      if (response.success === "success") {
        $state.go('app.enter_user_phone');
      } else {
        $state.go('login');
        // How do we do error handling with Angular forms?
        console.log("need to show some error handling on this form");
      }
    })
  }
// NOTE: Above function only works for new users. Need to rewrite login function.


  $scope.login = function() {
    var inputs = document.getElementsByTagName('input')
    console.log(inputs)
    var email = inputs[0].value
    var password = inputs[1].value
    var data = {email: email, password: password}
    // double check the naming on these variables so they are logical
    console.log(data)

    // var userId = 1 //window.localStorage['user_id']; // need new way to set this
    // Not sure why this keeps navigating to localhost:8100/login
    // when the request is supposed to be hitting a different URL
    request = {
      method: "POST",
      url: 'http://localhost:3000/users/'+userId+'/login',
      data: data
      // dataType: 'json'
    };
    console.log(request);

    $http(request)
    .success(function(response) {
      console.log(response);
      if (response.success === "user exists, set to logged in") {
        $state.go('app.new_message');
      } else {
        $state.go('login');
        // How do we do error handling with Angular forms?
        console.log("user not found, can't log in. Need to show error");
      }
    })
    console.log("in login controller login function")
  }
// Old OAuth function
//     // $auth.authenticate('google')
//     // .then(function(resp) {
//     //   window.localStorage['user_id'] = resp.id;
//     //   window.localStorage['activeSession'] = true;
//     //   if (resp.phone_verified === "false") {
//     //     $state.go('app.enter_user_phone');
//     //   } else if (resp.phone_verified === "true") {
//     //     $state.go('app.new_message');
//     //   }
//     // })
//     // .catch(function(resp) {
//     //   console.log("error");
//     // });

  // $scope.activeSession = function(){
  //   return window.localStorage['activeSession'] === "true";
  // };
})


.controller('ScheduledCtrl', function($scope, $state, $http) {

  $scope.refreshScheduled = function(){
    var getScheduled = {
      method: 'GET',
      url: 'http://localhost:3000/users/'+localStorage.user_id+'/messages?sent=false',
    };

    $http(getScheduled)
    .success(function(response) {
      $scope.scheduledMessages = response.messages;
    })
    .error(function(response) {
      console.log(response);
    })
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.deleteMessage = function(message) {
    $scope.scheduledMessages.splice($scope.scheduledMessages.indexOf(message), 1);
    $http({
      method: 'DELETE',
      url: 'http://localhost:3000/users/'+localStorage.user_id+'/messages/'+message.id,
    }).success(function() {console.log("success!");
  })
  }



})

.controller('DeliveredCtrl', function($scope, $state, $http) {
  $scope.refreshDelivered = function(){
    var getDelivered = {
      method: 'GET',
      url: 'http://localhost:3000/users/'+localStorage.user_id+'/messages?sent=true',
    };

    $http(getDelivered)
    .success(function(response) {
      $scope.deliveredMessages = response.messages.reverse();
    })
    .error(function(response) {
      console.log(response);
    })
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  $scope.deleteMessage = function(message) {
    $scope.deliveredMessages.splice($scope.deliveredMessages.indexOf(message), 1);
    $http({
      method: 'DELETE',
      url: 'http://localhost:3000/users/'+localStorage.user_id+'/messages/'+message.id,
    }).success(function() {
      console.log("success!");
    })
  }
})
