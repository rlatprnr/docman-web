'use strict';

/**
 * @ngdoc overview
 * @name docmanWebApp
 * @description
 * # docmanWebApp
 *
 * Main module of the application.
 */
angular
  .module('docmanWebApp', [
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'darthwade.dwLoading',
    'docman.encrypt',
    'docman.loading',
    'docman.auth',
    'docman.user-model',
    'docman.fund-model',
    'docman.doc-model',
    'docman.follower-model',
    'docman.verify',
    'docman.user',
    'docman.funds',
    'docman.followers',
    'docman.subscription'
  ])

  .config(function ($stateProvider, $urlRouterProvider) {

    // firebase setting

    firebase.initializeApp({
      apiKey: "AIzaSyCs6iT2UqzuAWBG_1WdC9FM4JxV91mgoOE",
      authDomain: "docman-1b904.firebaseapp.com",
      databaseURL: "https://docman-1b904.firebaseio.com",
      storageBucket: "docman-1b904.appspot.com"
    });

  	// states settings

	  $urlRouterProvider.otherwise('/login/signin');
	  
    $stateProvider
    
    .state('verify', {
      url: '/verify/:id',
      templateUrl: 'views/verify.html',
      controller: 'VerifyCtrl'
    })

    .state('login', {
      url: '/login',
      abstract: true,
      templateUrl: 'views/login.html',
      data: {
        redirectIfAuth: true
      }
    })

    .state('login.signin', {
      url: '/signin',
      templateUrl: 'views/login-signin.html',
      controller: 'LoginCtrl'      
    })

    .state('login.register', {
      url: '/register',
      templateUrl: 'views/login-signup.html',
      controller: 'RegisterCtrl'
    })

    .state('login.forget', {
      url: '/forget',
      templateUrl: 'views/login-forget.html',
      controller: 'ForgetCtrl'
    })

    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'views/main.html',
      data: {
        auth: true
      }
    })

    .state('main.profile', {
      url: '/profile',
      views: {
        'main-profile': {
          templateUrl: 'views/main-profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })

    .state('main.funds', {
      url: '/funds',
      views: {
        'main-funds': {
          templateUrl: 'views/main-funds.html',
          controller: 'FundsCtrl'
        }
      }
    })

    .state('main.followers', {
      url: '/followers',
      views: {
        'main-followers': {
          templateUrl: 'views/main-followers.html',
          controller: 'FollowersCtrl'
        }
      }
    })

    .state('main.subscription', {
      url: '/subscription',
      views: {
        'main-subscription': {
          templateUrl: 'views/main-subscription.html',
          controller: 'SubscriptionCtrl'
        }
      }
    })    

  })

  .run(function($rootScope, $state, $http, Auth) {

    $rootScope.$on('$stateChangeStart', function(event, next) {
      if (Auth.getID()) {
        if (next.data && next.data.redirectIfAuth) {
          event.preventDefault();
          $state.go('main.profile');
        }
      } else {
        if (next.data && next.data.auth) {
          event.preventDefault();
          $state.go('login.signin');
        }
      }
    });

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

  })

  .controller('DocmanCtrl', function($scope, $http, $window, Auth, Config) {

    $scope.lang = {};
    $scope.ui = {};

    $scope.first = Auth.getID() == null;
    $scope.isLogged = Auth.getID();

    // get language

    $http.get('lang.json',{
    }).then(function(result){
      $scope.lang = result.data;
      
      var lang = $window.localStorage.getItem('docman-lang');
      if (!lang) {
        lang = 'en';
      }
      $scope.ui = $scope.lang[lang];
    });

    $http.get('config.json',{
    }).then(function(result){
      Config.base_url = result.data.base_url;
      Config.email_gateway = result.data.email_gateway;
    });

    // logout
    
    $scope.logout = function() {
      Auth.signOut();
      $scope.isLogged = false;
    };

    $scope.changeLan = function(lang) {
      $window.localStorage.setItem('docman-lang', lang);
      $scope.ui = $scope.lang[lang];
    }

  })




