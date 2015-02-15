// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

// ROOT APP
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

// SEND VERIFICATION CODE
  .state('app.send_verification_code', {
    url: "/send_verification_code",
    views: {
      'menuContent': {
        templateUrl: "templates/send_verification_code.html",
        controller: 'SendVerificationCodeCtrl'
      }
    }
  })

// VERIFY CODE
  .state('app.verify_code', {
    url: "/verify_code",
    views: {
      'menuContent': {
        templateUrl: "templates/verify_code.html",
        controller: 'VerifyCodeCtrl'
      }
    }
  })

// NEW MESSAGE
  .state('app.new_message', {
    url: "/new_message",
    views: {
      'menuContent': {
        templateUrl: "templates/new_message.html",
        controller: 'NewMessageCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/new_message');
});
