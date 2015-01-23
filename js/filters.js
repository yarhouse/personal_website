'use strict';

/* Filters */

angular.module('webPortfolio.filters', [])
.filter('interpolate', ['version', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
}])
.filter('formatDatetime', function($rootScope, $filter) {
    return function (value) {
      var format = '';
      var lang = $rootScope.userlang;

      if (lang.indexOf('nl') === 0) {
        format = "dd-MM-yy HH:mm"; // nl
      } else if(lang.indexOf('en') === 0) {
        format = "M/d/yy h:mm a"; // en-us
      } else {
        format = "yyyy/MM/dd HH:mm"; // en-us
      };

      return $filter('date')(value, format);
    };
})
.filter('formatMilliseconds', function() {
  return function (value) {
    var numyears    = Math.floor(value / 31536000000);
    var numdays     = Math.floor((value % 31536000000) / 86400000); 
    var numhours    = Math.floor(((value % 31536000000) % 86400000) / 3600000);
    var numminutes  = Math.floor((((value % 31536000000) % 86400000) % 3600000) / 60000);
    var numseconds  = Math.floor(((((value % 31536000000) % 86400000) % 3600000) % 60000) / 1000);
    
    var string = new Array();

    if (numyears == 1) {
      string.push(numyears + " year");
    } else if (numyears > 1) {
      string.push(numyears + " years");
    }

    if (numdays == 1) {
      string.push(numdays + " day");
    } else if (numdays > 1) {
      string.push(numdays + " days");
    } 

    if (numhours == 1) {
      string.push(numhours + " hour");
    } else if (numhours > 1) {
      string.push(numhours + " hours");
    }

    if (numminutes == 1) {
      string.push(numminutes + " minute");
    } else if (numminutes > 1) {
      string.push(numminutes + " minutes");
    }
    // Its easier to leave off seconds right now for displaying time in the tooltips
    // Consider writing if/else to add 1 minute, 1 hour, 1 year if seconds are over 30
    // if (numseconds > 0) {
    //   string.push(" " + numseconds + " seconds");
    // };
    return string.join(', ');
  };
})
.filter('formatTime', function() {
  return function (value) {
    var hours, min  = 0;
    var string      = '';
    var daySuffix   = "D ";
    var hoursSuffix = "H ";
    var minSuffix   = "M";
    var spanStart   = "<span>";
    var spanFinish  = "</span>";

    if ( (days = Math.floor(value/1440)) > 0) {
      value = Math.round(value % 1440);
    } 

    hours = Math.floor(value/60);
    min   = Math.round(value % 60);
    
    if(days > 0) {
      string = string + spanStart + days + daySuffix + spanFinish;
    } 
    if(hours > 0) {
      string = string + spanStart + hours + hoursSuffix + spanFinish;
    }
    if(min > 0) {
      string = string + spanStart + min + minSuffix + spanFinish;
    }
    if (days === 0 && hours === 0 && min === 0) {
      string = spanStart + 'N/A' + spanFinish 
    };
    return string;
  };
})
.filter('stripString', function () {
  return function (input) {
    if (input) {
      return input.replace(/[\_\-\+\=\|\:\;\"\'\<\,\>\.\?\\\*\/]/g, ' ');
    }
  };
});
