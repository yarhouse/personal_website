'use strict';

// Declare app level module which depends on filters, and services
angular.module('webPortfolio', [
  'ngRoute',
  'ngAnimate',
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
  $routeProvider.when('/samples', {
    templateUrl: 'partials/samples.html', 
    controller: 'SamplesCtrl',
    loginRequired: false
  });

  $routeProvider.otherwise({redirectTo: '/'});
}]);