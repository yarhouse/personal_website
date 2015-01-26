'use strict';

/* Controllers */

/* section list:
 ************************************

 * Dashboard

*/
var staticData;
var financialData

angular.module('webPortfolio.controllers', [])
.run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 40;   // always scroll by 30 extra pixels
}])
.controller('ApplicationCtrl', 
  ['$scope', '$timeout', '$window', '$modal', '$location', '$filter', '$anchorScroll',
  function($scope, $timeout, $window, $modal, $location, $filter, $anchorScroll) {
  
  var banner = $(".jumbotron.banner").innerHeight();
  $(".opaque").height(banner);
  $(".image").height(banner);
  $( window ).resize(function() {
    banner = $(".jumbotron.banner").innerHeight();
    $(".opaque").height(banner);
    $(".image").height(banner);
  });


  $scope.scrollTo = function(id) {
    $timeout(function() {
      $location.hash(id);
      $anchorScroll();
    }, 10);
  }
  $timeout(function() {$('.footable').footable();}, 1);
}])
.controller('ProfileCtrl', ['$scope', '$timeout', function($scope, $timeout) {
  $timeout(function() {$('.footable').footable();}, 1);
}])
.controller('AboutCtrl', ['$scope', 'RandomBits', function($scope, RandomBits) {
  	$scope.$emit('TabSelected', "profile");
    var myFacts = [ 
      {"fact":"<i class='fa-li fa fa-map-marker'></i> I was born and raised in southeastern Conneticut with all the Navy brats"},
      {"fact":"<i class='fa-li fa fa-home'></i> I've lived in Florida just over half my life, but can't stand the taste of seafood"},
      {"fact":"<i class='fa-li fa fa-university'></i> I taught 3rd &amp; 4th grade ELCA sunday school for 10 years alongside my mother"},
      {"fact":"<i class='fa-li fa fa-microphone'></i> I wrote, produced, and performed in a <em>nerdcore ninja&#8209;hip&#8209;hop</em> duo"},
      {"fact":"<i class='fa-li fa fa-heart'></i> My wife and I were married 10 yrs to&#8209;the&#8209;day from when we first met"},
      {"fact":"<i class='fa-li fa fa-calculator'></i> I wrote my first program on a TI&#8209;86 to calculate THAC0 for 2e Advanced Dungeons &amp; Dragons"}
    ]
    var coolStuff = [
      {"coolthing":"Captain America, especially the Marvel Ultimates version."},
      {"coolthing":"Battlestar Galactica, the 2004 Syfy series. So say we all!"},
      {"coolthing":"Dungeons &amp; Dragons, 2e through 5e. Tabletop game groups forever."},
      {"coolthing":"Skyrim and all the mods I can add to it."},
      {"coolthing":"Game of Thrones, and reading online spoilers and theories. R+L=J, ijs."},
      {"coolthing":"Google. I use everything Google, and look forward to my robot overlords."},
      {"coolthing":"organizing everything. Everything. Tedious organizing is my jam"},
      {"coolthing":"slim-cut suits, because I'm finally an adult with proper fashion tastes."},
      {"coolthing":"Popeyes Chicken &amp; Biscuts, and make it spicy!"}
    ]
    $scope.factList = RandomBits.facts(myFacts);
    $scope.coolList = RandomBits.coolthings(coolStuff);
    $scope.newRandom = function(){
      $scope.factList = RandomBits.facts(myFacts);
      $scope.coolList = RandomBits.coolthings(coolStuff);
    }
}])
.controller('TechnicalCtrl', ['$scope', function($scope) {}])
.controller('ExperienceCtrl', ['$scope', function($scope) {
  $scope.oneAtATime = true;
  $scope.employers = [
    {
      "name":"Jitscale, Inc.",
      "dates":"March 2013 - January 2015",
      "description":"IT Cloud Service Management &amp; Support",
      "title":"Front-End Development; Jr. Rails Developer; UI design",
      "jobs":[
        {"duty":"Implement complex web application design for company client product"},
        {"duty":"Built entire company website redesign based off contracted graphic designer images"},
        {"duty":"Implement development standards including RVM, git"},
        {"duty":"Produce demo layout and applications for marketing &amp; sales team meetings"},
        {"duty":"Refactor existing company applications to new standards and code"},
        {"duty":"Create custom design and layout to meet needs of company product"},
        {"duty":"Manage U.S. team meeting schedule with home team in The Netherlands"},
        {"duty":"Advise other developers on useful layout techniques for company projects"},
        {"duty":"Introduced new languages into development team"},
        {"duty":"Given creative control for UI development on new projects"}
      ]
    },{
      "name":"Cloudspace, Inc.",
      "dates":"December 2012 - January 2013",
      "description":"Agile Software Development Shop",
      "title":"Front-End Design/Web Development (Contract)",
      "jobs":[
        {"duty":"Implemented complex web application design for client product"},
        {"duty":"Advised other developers on useful design techniques for their client projects"}
      ]
    },{
      "name":"HostDime.com",
      "dates":"October 2012 - February 2013",
      "description":"Webhosting Provider",
      "title":"Server Analyst I",
      "jobs":[
        {"duty":"Resolve domain error issues"},
        {"duty":"Edit and update DNS information"},
        {"duty":"Monitor server load during peak times of usage"},
        {"duty":"Troubleshoot server issues for managed/dedicated clients"}
      ]
    },{
      "name":"Nerdapalooza, LLC",
      "dates":"April 2009 - October 2013",
      "description":"Nerdy Music and Art Festival and Showcase",
      "title":"Event Director; Co-Owner",
      "jobs":[
        {"duty":"Plan and organize yearly event with diverse staff and board of directors"},
        {"duty":"Organize and oversee committees involved in production"},
        {"duty":"Broker rates for event space and hotel with various companies"},
        {"duty":"Manage staff during event weekend to ensure proper execution of festival"}
      ]
    },{
      "name":"Glassdoctor of Orlando",
      "dates":"August 2009 – March 2012",
      "description":"Residential, Commercial, &amp; Auto Glass Repair",
      "title":"Glazier; Inside Sale Representative",
      "jobs":[
        {"duty":"[Glazier] Repair and installation of various flat glass products"},
        {"duty":"[Glazier] Received incoming parts and stock as well as vendor returns"},
        {"duty":"[Inside Sales Rep] Maintained quality phone and walk-in service with customers"},
        {"duty":"[Inside Sales Rep] Introduced improved record-keeping methods within office"},
        {"duty":"[Inside Sales Rep] Designed new manufacturing and job layout reference sheets"},
        {"duty":"[Inside Sales Rep] Scheduled daily work flow for quickly changing and adapting field jobs"}
      ]        
    }
  ];
}])
.controller('ProjectsCtrl', ['$scope', '$timeout', '$filter', function($scope, $timeout, $filter) {}])
//  low-level AJAX resquest for a data object
.run(function($http){
  $http.get("../json/ngtableData.json").success(function(data){
    financialData = data;
  });
})
.controller('CodeCtrl', 
  ['$scope', '$filter', 'TimelineData', 'FormatJSON', 'Graph', 'ngTableParams', '$sce', '$timeout', 'ngTableColumn', 
  function($scope, $filter, TimelineData, FormatJSON, Graph, ngTableParams, $sce, $timeout, ngTableColumn) {

  // =====================================================================================================  
  // format json highcharts

  var eachRowHeight     = 50; // HIGHLY RECOMMENDED THAT THIS VALUE STAYS ABOVE 49px
  var environmentWidth  = 40;
  var serverWidth       = eachRowHeight * 0.8; // 80% of 50 = 40px point thickness
  var pointPadding      = eachRowHeight * 0.1; // 10% of 50 = 5px point thickness padding wrap
  var blankWidth        = 0;
  $scope.labelHeight    = eachRowHeight;
  var legendHeight      = 100;
  var formatJSONVariables = {
    "availgreen":       {name:'Available',            color:'#47A247'},
    "unavailred":       {name:'Unavailable',          color:'#BE5454'},
    "maintyellow":      {name:'Maintenance',          color:'rgba(226, 170, 0, 0.75)'},
    "notconfig":        {name:'System Not Configured',color:'#555'}, // Systems not in check_mk: 'System Not Configured', dark grey
    "unmapped":         {name:'Updating',             color:'#69EE69'}, // Unmapped: 'Updating' / light-green?
    "unregstd":         {name:'No Data',              color:"#666"}, // No data from check_mk (e.g. host was added later): 'No Data', dark grey
    "serverWidth":      serverWidth
  }

  $scope.orgJson
  $scope.newJson
  $scope.loadTimelineData = function () {
    TimelineData.query().$promise.then( function(TimeData){ // success callback  
      $scope.orgJson = angular.toJson(TimeData,true);
      var availability = TimeData.availability;
      var time_start = new Date(TimeData.time_start).getTime();
      var time_end = new Date(TimeData.time_end).getTime();
      var finalResult = FormatJSON.config(availability, time_end, formatJSONVariables);
      $scope.newJson = angular.toJson(finalResult,true);
      $scope.timelineChartConfig                             = angular.copy(Graph.timelineTemplate());
      $scope.timelineChartConfig.series                      = finalResult.series;
      $scope.timelineChartConfig.title.text                  = finalResult.company.name;
      $scope.timelineChartConfig.yAxis.showFirstLabel        = false;
      $scope.timelineChartConfig.options.chart.height        = (finalResult.rows * (serverWidth + (pointPadding * 2))) + legendHeight;
      $scope.timelineChartConfig.options.chart.marginBottom  = legendHeight + 2, // margin has to be 2px larger than the additional px added to chart.height for the legend
      $scope.timelineChartConfig.options.tooltip.formatter   = function() {
        var difference = (this.point.high - this.point.low);
        var header = '<div style="padding: 3px 8px; color: #222;border: 1px solid #000 ;background-color:' + this.series.color + '"><b>'+this.series.name +'</b></div><div style="padding: 3px 8px; ">'+ $filter('formatMilliseconds')(difference) + '</div>';
        return header;
      }
      $scope.timelineChartConfig.options.plotOptions.series.events.legendItemClick = function () {return false;}
      $scope.timelineChartConfig.options.plotOptions.series.point.events.click = function() {
        var difference = (this.high - this.low);
        var header = '<b>'+ this.name +' - '+this.series.name +'</b>'+'<br/>'+ $filter('formatMilliseconds')(difference);
        var body;

        if (this.series.name == "Updating") {
          body = 'This data is being updated';
        } else  {
          body = Highcharts.dateFormat('%a, %b %e, %Y, %H:%M',this.low)+' through '+
                 Highcharts.dateFormat('%a, %b %e, %Y, %H:%M',this.high);
        }
        $("#timeline_total").html('<div class="row"><div class="col-xs-12"><h4 style="padding: 3px 8px; color: #222;border: 1px solid #000 ;background-color:' + this.series.color + '">'+ $scope.allPercentages[this.x].uptime_percent +'%</h4></div></div>');
        $("#timeline_tooltip").html(header+'<br/>'+body);
      }
      $scope.totalServersForCompany = finalResult.rows;
      $scope.totalRespondingServers = finalResult.rows - finalResult.notconfigLength;
      $scope.totalPercentResponding = ($scope.totalRespondingServers / $scope.totalServersForCompany) * 100;
      $scope.allPercentages = finalResult.allPercentages;
    }, function(error) {
      $scope.$emit(AUTH_EVENTS.serverError);
    });
  };
  $scope.loadTimelineData();
  $scope.consolePrint = function(param){
    console.log(param);
  }


  // =====================================================================================================
  // ng table footable
  
  var ngtableData = financialData.data
  $scope.groupby = 'none'
  $scope.tableParams = new ngTableParams({
    page: 1,            // show first page
    count: 10,          // count per page
    sorting: {
      subject: 'asc'     // initial sorting
    }
  }, {
    total: ngtableData.length, // length of data
    getData: function($defer, params) {
      var orderedData = params.sorting() ?
              $filter('orderBy')(ngtableData, params.orderBy()) :
              ngtableData;

      $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      $timeout(function() {
        $('.footable').trigger('footable_redraw','footable_toggle_row');
      }, 0);
      $timeout(function() {
        $scope.columnSpan = $('.footable tbody:first-of-type tr:first-of-type + tr.primary-row:not(.ng-table-group) td.footable-visible:not(.ng-hide)').length;
      }, 10);
    },
    filterDelay: 10
  });
  $('.footable').footable({
    breakpoints: {
      phone:767,
      tablet:992
    }
  });

  
  $scope.totalHours = function(key){
    return ngTableColumn.total(ngtableData, key);
  }

  // This was planned for possibly trying to display groupby totals
  // $scope.getGroup_NIH = function(){ 
  //   var total = 0;
  //   for(var i = 0; i < $scope.group.value.length; i++){
  //       var product = $scope.group.value[i];
  //       total += (product.not_invoiceable_hours * 1);
  //   }
  //   return total;        
  // };

  $timeout(function() {
    $scope.$watch('groupby', function(value){
      $scope.tableParams.settings().groupBy = value;
      $scope.tableParams.reload();
    });
  }, 10);
}]);
