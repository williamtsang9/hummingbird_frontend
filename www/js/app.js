// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ui.mask', 'pickadate'])

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

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $stateProvider

// ROOT APP
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

// SEND VERIFICATION CODE
  .state('app.enter_user_phone', {
    url: "/enter_user_phone",
    views: {
      'menuContent': {
        templateUrl: "templates/login/enter_user_phone.html",
        controller: 'EnterUserPhoneCtrl'
      }
    }
  })

// VERIFY CODE
  .state('app.verify_code', {
    url: "/verify_code",
    views: {
      'menuContent': {
        templateUrl: "templates/login/verify_code.html",
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
  // SCHEDULED
  .state('app.scheduled', {
    url: "/scheduled",
    views: {
      'menuContent': {
        templateUrl: 'templates/scheduled/scheduled.html',
        controller: 'ScheduledCtrl'
      }
    }
  })

  // DELIVERED
  .state('app.delivered', {
    url: "/delivered",
    views: {
      'menuContent': {
        templateUrl: 'templates/delivered/delivered.html',
        controller: 'DeliveredCtrl'
      }
    }
  })

  // LOGIN

  .state('login', {
    url: "/login",
    templateUrl: "templates/login/login.html",
    controller: 'LoginCtrl'
  })




  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
