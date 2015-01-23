'use strict';

/* Controllers */

/* section list:
 ************************************

 * Dashboard

*/
var staticData;
var financialData;

angular.module('webPortfolio.controllers', [])
.run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 30;   // always scroll by 30 extra pixels
}])
.controller('ApplicationCtrl', 
  ['$scope', '$rootScope', '$window', '$modal', '$location', '$filter', '$anchorScroll',
  function($scope, $rootScope, $window, $modal, $location, $filter, $anchorScroll) {
  
  $scope.scrollTo = function(id) {
    $location.hash(id);
    $anchorScroll();
  }

  

}]);
