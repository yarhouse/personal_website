'use strict';

// Declare app level module which depends on filters, and services
angular.module('webPortfolio', [
  'ngRoute',
  'ngAria',
  'ngAnimate',
  'ngMessages',
  'ngResource',
  'ngSanitize',
  'highcharts-ng',
  'ngTouch',
  'webPortfolio.filters',
  'webPortfolio.services',
  'webPortfolio.directives',
  'webPortfolio.controllers',
  'ngTable',
  'ngCookies',
  'ui.bootstrap',
  'ui.scrollfix'
]).
config(['$routeProvider', function($routeProvider) {
  // Apparently it really is as simple as passing a variable through like this in routeProvider?
  // Thanks for being so clear, Angular documentation.
  $routeProvider.
    when('/profile', {
      templateUrl: 'partials/profile.html', 
      controller: 'AboutCtrl',
      loginRequired: false
    }).
    when('/code', {
      templateUrl: 'partials/code.html', 
      controller: 'CodeCtrl',
      loginRequired: false
    }).
    otherwise({redirectTo: '/profile'});
}]);