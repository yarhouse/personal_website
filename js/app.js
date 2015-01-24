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
  $routeProvider.when('/profile', {
    templateUrl: 'partials/profile.html', 
    controller: 'ProfileCtrl',
    loginRequired: false
  })
  .when('/technical', {
    templateUrl: 'partials/technical.html', 
    controller: 'TechnicalCtrl',
    loginRequired: false
  })
  .when('/experience', {
    templateUrl: 'partials/experience.html', 
    controller: 'ExperienceCtrl',
    loginRequired: false
  })
  .when('/projects', {
    templateUrl: 'partials/projects.html', 
    controller: 'ProjectsCtrl',
    loginRequired: false
  })
  .otherwise({redirectTo: '/profile'});
}]);