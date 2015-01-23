'use strict';

/* Services */


angular.module('webPortfolio.services', []).
value('version', '0.1')
.factory('Session', 
  ['$cookieStore', '$http', 
  function ($cookieStore, $http) {

    this.create = function(credentials) {
      this.credentials = credentials;
      $cookieStore.put('authdata', credentials);
      this.setHTTPHeaders();
    };

    this.destroy = function () {
      this.credentials = null;
      $cookieStore.remove('authdata');
    };

    this.setHTTPHeaders = function() {
      $http.defaults.withCredentials = true;
      $http.defaults.headers.common['Authorization'] = 'Basic ' + this.credentials;
    };

    if(!this.credentials){
      // Restore cookie contents, if they exist      
      if($cookieStore.get('authdata')) {
        this.credentials = $cookieStore.get('authdata');
        this.setHTTPHeaders();
      };
    };
    return this;
  }
])
.factory('DateRange',
  function($rootScope, $filter) {
    // var lastWeek = $filter('date')(lastWeekUnformatted, 'yyyy-MM-dd');
    return {
      start: function() {
        return $rootScope.startTime;
      },
      setStart: function(start) {
        $rootScope.startTime   = start;

        $rootScope.startTime = $filter('date')($rootScope.startTime, 'MMMM d, yyyy');
      },
      end: function() {
        return $rootScope.endTime;
      },
      setEnd: function(end) {
        $rootScope.endTime   = end;
        $rootScope.baseDate  = end;

        $rootScope.endTime = $filter('date')($rootScope.endTime, 'MMMM d, yyyy');
        // $rootScope.baseDate = $filter('date')($rootScope.baseDate, 'MMMM dd, yyyy');

      },
      initialize: function() {
        $rootScope.endTime   = new Date();
        $rootScope.baseDate  = $rootScope.endTime;
        $rootScope.startTime = new Date($rootScope.endTime.getTime());
        $rootScope.startTime.setDate($rootScope.endTime.getDate() - 7);

        $rootScope.endTime = $filter('date')($rootScope.endTime, 'MMMM d, yyyy');
        // $rootScope.baseDate = $filter('date')($rootScope.baseDate, 'MMMM dd, yyyy');
        $rootScope.startTime = $filter('date')($rootScope.startTime, 'MMMM d, yyyy');
        
        $rootScope.timeRange = 'week';
      },
      setByRange: function(range) {
        var mod = (1000*60*60*24);
        if (range == "week") {
          $rootScope.startTime = new Date($rootScope.baseDate - (7 * mod));
          $rootScope.startTime = $filter('date')($rootScope.startTime, 'MMMM d, yyyy');
        } else if (range == "month") {
          $rootScope.startTime = new Date($rootScope.baseDate - (30 * mod));
          $rootScope.startTime = $filter('date')($rootScope.startTime, 'MMMM d, yyyy');
        } else if (range == "quarter") {
          $rootScope.startTime = new Date($rootScope.baseDate - (90 * mod));
          $rootScope.startTime = $filter('date')($rootScope.startTime, 'MMMM d, yyyy');
        } else if (range == "year") {
          $rootScope.startTime = new Date($rootScope.baseDate - (365 * mod));
          $rootScope.startTime = $filter('date')($rootScope.startTime, 'MMMM d, yyyy');
        }
      }
    }

  }
)
.factory('FormatJSON', 
  [ '$filter', '$timeout',
  function ($filter, $timeout) {
    return {
      config: function(dataobject, time_end, options) {
        var availability = dataobject; 
        var company = availability.company;
        var numberofrows = company.totalseries;
        var companyID = company.id;
        var series = company.series;
        var allPercentages = new Array();
        var chartdata = new Array();
        var each_unmapped_time = Array.apply(null, new Array(numberofrows)).map(Number.prototype.valueOf, 0);
        var new_end_time = Array.apply(null, new Array(numberofrows)).map(Number.prototype.valueOf, time_end);
        var totalUpTime = Array.apply(null, new Array(numberofrows)).map(Number.prototype.valueOf, 0);
        var totalDownTime = Array.apply(null, new Array(numberofrows)).map(Number.prototype.valueOf, 0);
        var totalMaintTime = Array.apply(null, new Array(numberofrows)).map(Number.prototype.valueOf, 0);
        var topThreePercents = new Array();

        // =====================================================================================================
        // Creates the formated object for Highcharts columnrange chart. Done. You have a timeline.
        for (var i = 0; i < series.length; i++) {
          if (series[i].name === 'Up') {
            
            var upHash = {"name":series[i].name, // Put Available as series name
                          "data": series[i].data, // The range point data from JSON to be read by Highcharts
                          "color": options.availgreen.color, // Color variable
                          "pointWidth": options.serverWidth}; // Variable for width/thickness of range points
            var upDataLength = series[i].data.length; // Count how many individual range points for entire Available series
            chartdata.push(upHash);
          } else if (series[i].name === 'Down') {
            
            var downHash = {"name":series[i].name, 
                            "data": series[i].data, 
                            "color": options.unavailred.color, 
                            "pointWidth": options.serverWidth};
            var downDataLength = series[i].data.length;
            chartdata.push(downHash);
          } else if (series[i].name === 'Maintenance') {
            
            var maintHash = {"name":series[i].name, 
                            "data": series[i].data, 
                            "color": options.maintyellow.color, 
                            "pointWidth": (options.serverWidth / 2.5)};
            var maintDataLength = series[i].data.length;
            chartdata.push(maintHash);
          } else if (series[i].name === 'Unmapped') {
            
            // if the unmapped data is less than 60 seconds (one minute) total time, 
            // splice it from the array before pushing to the series
            // for (var d = series[i].data.length - 1; d >= 0; d--) {
            //   if (series[i].data[d].high - series[i].data[d].low < 60000 ) {
            //     series[i].data.splice(d, 1);
            //   };
            // };

            var unmappedHash = {"name":options.unmapped.name, 
                                "data": series[i].data, 
                                "color": options.unmapped.color, 
                                "pointWidth": options.serverWidth, 
                                // "enableMouseTracking": false, 
                                showInLegend:false};
            var unmappedDataLength = series[i].data.length;
            chartdata.push(unmappedHash);
          } else if (series[i].name === 'Unregistered') { 
            
            var unregstdHash = {"name":options.unregstd.name, 
                                "data": series[i].data, 
                                "color": options.unregstd.color,
                                "pointWidth": options.serverWidth,
                                // "borderColor": "#333",
                                // "borderWidth": "2",
                                // "enableMouseTracking": false, 
                                showInLegend:false};
            var unregstdDataLength = series[i].data.length;
            chartdata.push(unregstdHash);
          } else if (series[i].name === 'No Data') {
            
            var notconfigHash = {"name":options.notconfig.name, 
                                "data": series[i].data, 
                                "color": options.notconfig.color, 
                                "pointWidth": options.serverWidth, 
                                // "enableMouseTracking": false, 
                                showInLegend:false};
            var notconfigLength = series[i].data.length;
            chartdata.push(notconfigHash);
          }
        }

        // =====================================================================================================
        // This is all to create percetages of uptime/downtime percents for each service/host

        // Created array of default objects
        for (var i = 0; i < numberofrows; i++) {
          allPercentages.push({
            'name':'No Data',
            'has_data':false,
            'uptime_percent':0,
            'is_available':false,
            'mainttime_percent':0,
            'in_maintinence':false,
          });
        };
        
        // Creating a new endtime for servers with unmapped time
        for (var dl = 0; dl < unmappedDataLength; dl++) { 
          var xpos = unmappedHash.data[dl].x;
          new_end_time[xpos] = unmappedHash.data[dl].low;
        }
        
        // This loop could be wholely unnessicary depending if we do nothing with 'No Data' series
        for (var dl = 0; dl < notconfigLength; dl++) {
          var xpos = notconfigHash.data[dl].x;
          allPercentages[xpos].name = notconfigHash.data[dl].name;
          allPercentages[xpos].has_data = false; // Default value, to skip when looping for top 3
        }

        for (var dl = 0; dl < upDataLength; dl++) {
          var xpos = upHash.data[dl].x;
          allPercentages[xpos].name = upHash.data[dl].name;
          totalUpTime[xpos] += (upHash.data[dl].high - upHash.data[dl].low); // Add total milliseconds in data point to current totalUpTime xpos index value
          var compare_uptime = $filter('number')( (upHash.data[dl].high / 10000 ), 0); // chopping off the 'seconds' of the epoch to compare with the new end time
          var compare_endtime = $filter('number')((new_end_time[xpos] / 10000 ), 0); // chopping off the 'seconds' to compare with the final high point
          allPercentages[xpos].is_available = (compare_uptime == compare_endtime) ? true : false; // Check if the endtime matches the final time in final xpos range point
          allPercentages[xpos].has_data = true;
        }

        // A complete run for Unavailabile has to be done as well, incase there is a 100% unavailable server, the uptime function above would comepltely miss it
        for (var dl = 0; dl < downDataLength; dl++) { 
          var xpos = downHash.data[dl].x;
          allPercentages[xpos].name = downHash.data[dl].name;
          totalDownTime[xpos] += (downHash.data[dl].high - downHash.data[dl].low);
          allPercentages[xpos].has_data = true;
        }

        // Maintinence has to be run for its own calculations outside of up/down, since servers can be in maintinence while in either up/down state
        for (var dl = 0; dl < maintDataLength; dl++) {
          var xpos = maintHash.data[dl].x;
          allPercentages[xpos].name = maintHash.data[dl].name;
          totalMaintTime[xpos] += (maintHash.data[dl].high - maintHash.data[dl].low);
          var mainttime_percent = (totalMaintTime[xpos] / (totalUpTime[xpos] + totalDownTime[xpos])) * 100;
          allPercentages[xpos].mainttime_percent = $filter('number')(mainttime_percent, 2);
          var compare_mainttime = $filter('number')( (maintHash.data[dl].high / 10000 ), 0); 
          var compare_endtime = $filter('number')((new_end_time[xpos] / 10000 ), 0); 
          allPercentages[xpos].in_maintinence = (compare_mainttime == compare_endtime) ? true : false; 
          allPercentages[xpos].has_data = true;
        }

        // Calculate the percentages based on uptime and downtime totals
        for (var i = 0; i < numberofrows; i++) {
          var uptime_percent = (totalUpTime[i] / (totalUpTime[i] + totalDownTime[i])) * 100; // Change the time to a percentage
          var downtime_percent = (totalDownTime[i] / (totalUpTime[i] + totalDownTime[i])) * 100;
          allPercentages[i].uptime_percent = $filter('number')(uptime_percent, 2); 
          allPercentages[i].downtime_percent = $filter('number')(downtime_percent, 2);
        }

        var result =  {
          'company' : companyID,
          'id': company.id,
          'rows': (numberofrows),
          'series': chartdata,
          'notconfigLength':notconfigLength
        };

        return result;
      },

      counter: function(index, param) {

        var divID = '#server_'+index+'_availability'
        var uptime_percent = param.uptime_percent
        var downtime_percent = param.downtime_percent
        var is_available = param.is_available
        var in_maintinence = param.in_maintinence
        var mainttime_percent = param.mainttime_percent
        var has_data = param.has_data

        if (has_data === true) {

          // Indicate the system is 'checking' the availability
          $(' .availabilty_indicators .red')
            .addClass('active')
            .attr('data-toggle', 'tootip')
            .attr('data-original-title', 'Checking')
            .tooltip('show');

          $timeout(function() { // 10millisec timeout to delay the data loading
            $( divID +' .availability_counter' ).countTo({
              from: 0,
              to: uptime_percent,
              speed: 5000,
              refreshInterval: 100,
              decimals: 2,
              onComplete: function(value) {

                if (uptime_percent == 100.00) {
                  $( divID +' .availability_counter').html('100');
                }

                if (is_available == true) {

                  $(divID +' .availabilty_indicators .red')
                   .removeClass('active')
                   .tooltip('destroy');
                  
                  $(divID +' .availabilty_indicators .green')
                    .addClass('active')
                    .attr('data-toggle', 'tootip')
                    .attr('data-original-title', uptime_percent+'% Available')
                    .tooltip('show');
                  
                  $timeout(function() {
                    $( divID +' .availabilty_indicators .green').tooltip('hide');
                  }, 3000);
                } else if (is_available != true) {

                  $(divID +' .availabilty_indicators .red')
                    .attr('data-original-title', downtime_percent+'% Unavailable')
                    .tooltip('show');

                  $timeout(function() {
                    $( divID +' .availabilty_indicators .red').tooltip('hide');
                  }, 3000);
                }

                if (in_maintinence == true) {
                  $( divID +' .availabilty_indicators .yellow')
                    .addClass('active')
                    .attr('data-toggle', 'tootip')
                    .attr('data-original-title', mainttime_percent+'% Maintenance')
                    .tooltip('show');

                  $timeout(function() {
                    $( divID +' .availabilty_indicators .yellow').tooltip('hide');
                  }, 3000);
                };
              }
            });
          }, 10);
        };
      }
    }
  }
])
.factory('Graph',
  function() {
    return {
      template: function(xAxis) {
      	var defaultChartConfig = {
          options: {
            chart: {
              type: 'column',
              backgroundColor: 'rgba(0,0,0,0)',
              plotBackgroundColor: 'rgba(0,0,0,0)',
              animation: false,
              shadow: false,
              height: 400,
            },
            colors: [ 
              // Websafe lighter variations
                      'rgba(153,51,51,1)', // #993333 web safe lighter tint of Maroon
                      'rgba(51,51,153,1)', // ##333399 web safe lighter tint of Navy
                      'rgba(153,153,51,1)', // #999933 web safe lighter tint of Olive
                      'rgba(153,51,153,1)', // #993399 web safe lighter tint of Purple
                      'rgba(51,153,153,1)', // #339999 web safe lighter tint of Teal
                      'rgba(51,153,51,1)', // #339933 web safe lighter tint of Green

              // Darker colors
                      'rgba(128,0,0,1)', // #800000 Maroon
                      'rgba(0,0,128,1)', // #000080 Navy 
                      'rgba(128,128,0,1)', // #808000 Olive 
                      'rgba(128,0,128,1)', // #800080 Purple 
                      'rgba(0,128,128,1)', // #008080 Teal 
                      'rgba(0,128,0,1)', // #008000 Green 
                    ],
            exporting: {enabled: true},
            legend: {
              itemStyle: {
                cursor: 'pointer',
                color: '#222',
                fontWeight: 'bold',
                fontFamily: 'Open Sans Condensed',
                fontSize: '1.25em',
              },
              verticalAlign: 'bottom',
              reversed: true,
              useHTML: false,
              layout: 'horizontal',
              align: 'top',
              itemMarginTop: 20,
              padding: 0,
              maxHeight: 45,
              navigation: {
                activeColor: '#3E576F',
                animation: true,
                arrowSize: 12,
                inactiveColor: '#CCC',
                style: {
                  fontWeight: 'bold',
                  color: '#333',
                  fontSize: '1.2em'
                }
              }
            },
            plotOptions: {
              column: {},
              line:{
                marker: {
                  enabled: false
                }
              },
              series: {
                borderColor: 'transparent',
                turboThreshold: 0, // disables threshhold, which restricted a series with more than 1000 data points from loading
                pointPadding: 0.05,
                groupPadding: 0.05,
                borderWidth: 0,
                stacking: 'normal'
              },
            },
            tooltip: {
              useHTML: true,
              style: {
                lineHeight:'150%',
              },
              followPointer: false,
              followTouchMove: false,
              hideDelay: 0,
              formatter: function() {
                var t = 0;
                var s = '';
                $.each(this.points, function () {t += this.y;});
                if (t > 0){
                  s = '<b>' + this.x + '</b>';
                  $.each(this.points, function () {
                    if (this.y != 0){
                      s += '<br/><span style="color:' + this.series.color + '">&block;&block;</span> ' + this.series.name + ': <b>' + this.y + '</b> (' + Math.round((((this.y) / t) * 100.00)) + '%)';
                    }
                  });
                  return s;
                }
                else return false;                
              },
              shared: true,
            }
          },
          xAxis: xAxis,
          title: {
            style: {
              display: 'none'
            },
          },
          yAxis: {
            allowDecimals: false,
            title: {text: '# of calls'},
          },
        };
        return defaultChartConfig;
      },
      timelineTemplate: function() {
        var defaultColumnRangeChart = {
          options: {
            chart: {
              type: 'columnrange',
              inverted: true,
              backgroundColor: 'rgba(0,0,0,0)',
              plotBackgroundColor: 'rgba(0,0,0,0)',
              animation: false,
              shadow: false,
              minRange: 86400000,
              spacingBottom: 15,
              spacingLeft: 0,
              spacingRight: 0,
              spacingTop: 0,
              marginBottom: null,
              marginLeft: 0,
              marginRight: 0,
              marginTop: 20,
              height: '',
              // zoomType: 'y',
              // http://jsfiddle.net/Gv7Tg/27/ LINKED ZOOMS SAVE THIS
              events: {
                load: function() {
                  // $timeout(function(){
                  //   $scope.updateChartData()              
                  //   console.log('--- $timeout is working ---');
                  // }, 5000);
                }
              },
            },
            exporting: {enabled: false},
            rangeSelector: {selected: 1},
            plotOptions: {
              series: {
                turboThreshold: 0, // disables threashhold, which restricted a series with more than 1000 data points from loading
                grouping: false, // stacks all the data timeline points into one row
                animation: false,    
                pointPadding: 10,
                groupPadding: 0,
                borderWidth: 0,
                minPointLength: 3,
                events: {
                  legendItemClick: function () {
                    return false; // Turns off click to toggle legend series. If toggle is wanted, we need to create a 100% blank data point, similar to no-data bar
                  }
                },
                point: {
                  events: {
                    // click: function () {
                    //   if (this.series.name == "Unmapped") {
                    //     alert('You selected '+ this.name + ' in ' + this.series.name + ' data.');
                    //   } else if (this.series.name != "Unmapped") {
                    //     null
                    //   };
                    // }
                  }
                }
              }
            },
            legend: {enabled: true},
            tooltip:{
              enabled: true,
              followPointer: true,
              followTouchMove: false,
              formatter: function() {
                var difference = (this.point.high - this.point.low);
                var header = '<b>'+ this.point.name +' - '+this.series.name +'</b>'+'<br/>'+ $filter('formatMilliseconds')(difference);
                var body;

                if (this.series.name == "Updating") {
                  body = 'This data is being updated';
                } else  {
                  body = Highcharts.dateFormat('%a, %b %e, %Y, %H:%M',this.point.low)+'<br/>'+
                         Highcharts.dateFormat('%a, %b %e, %Y, %H:%M',this.point.high);
                }
                return header+'<br/>'+body;
              },
              hideDelay: 0
            },
            scrollbar:{enabled: true}
          },
          series: [],
          title: {
            text: 'Hello',
            style: {
              display: 'none'
            }
          },
          // subtitle: {
          //     text: '* zoom to 20 minutes, pan with "shift" key',
          //     align: 'right',
          //     x: -10
          // },
          loading: false,
          xAxis: {
            type: 'category', // Pulls the 'name' from 'data'
            startOnTick: false,
            endOnTick: false,
            maxPadding: 0,
            minPadding: 0,
            labels: {
              align: 'left',
              enabled: true,
              style: {
                fontFamily: 'Open Sans Condensed',
                fontWeight:'bold',
                // color: '#FFFFFF',
                // textShadow: '-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000 ', // black stroke
                color: '#000',
                textShadow: '-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff,1px 1px 0 #fff ', // white stroke
                fontSize: '1.5em',
                whiteSpace: 'nowrap' 
              },
              x: 20, // Pushes labels, like a margin-left
            },
          },
          yAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {day: '%a %e %b'},
            title: {text: null},
            offset: 0,
            labels: {rotation: -30},
            startOnTick: false,
            endOnTick: false,
            maxPadding: 0.01,
            minPadding: 0.01,
                  minRange: 1200000,  // zoom stops at 1 minute range (milliseconds)
            stackLabels: {
              style:{color: 'black'},
              enabled: true
            },
            showFirstLabel: true
          },
          useHighStocks: false
          //function (optional)
          // func: function (chart) {
          //   //setup some logic for the chart
          // }
        };
        return defaultColumnRangeChart;
      },
      config: function(chart, series, title, options, colors) {
        chart['series']                    = series;
        chart['title']['text']             = title;
        chart.options.plotOptions.series   = options;
        chart['options']['colors']         = colors;
        return chart;
      },
      getTotalCalls: function(params) {
        var dataLength  = params.releaseSeries[0].data.length;
        var blank       = Array.apply(null, new Array(dataLength)).map(Number.prototype.valueOf, 0);
        var releaseData         = angular.copy(blank);
        var changeData          = angular.copy(blank);
        var serviceRequestData  = angular.copy(blank);
        var incidentsData       = angular.copy(blank);

        for(var i = 0; i < params.releaseSeries.length; i++) {
          for(var j = 0; j < params.releaseSeries[0].data.length; j++) {
            releaseData[j] += params.releaseSeries[i].data[j];
          }
        };
        var releaseHash = { "data": releaseData,"name": params.releaseTitle};
        for(var i = 0; i < params.changeSeries.length; i++) {
          for(var j = 0; j < params.changeSeries[0].data.length; j++) {
            changeData[j] += params.changeSeries[i].data[j];
          }
        };
        var changeHash = {"data": changeData,"name": params.changeTitle};
        for(var i = 0; i < params.serviceRequestSeries.length; i++) {
          for(var j = 0; j < params.serviceRequestSeries[0].data.length; j++) {
            serviceRequestData[j] += params.serviceRequestSeries[i].data[j];
          }
        };
        var serviceRequestHash = {"data": serviceRequestData,"name": params.serviceRequestTitle};
        for(var i = 0; i < params.incidentSeries.length; i++) {
          for(var j = 0; j < params.incidentSeries[0].data.length; j++) {
            incidentsData[j] += params.incidentSeries[i].data[j];
          }
        };
        var incidentsHash = { "data": incidentsData,"name": params.incidentTitle};
        var result = {"calls_by_type": [releaseHash, changeHash, serviceRequestHash, incidentsHash]};
        return result;
      },
      swapChartStack: function(chart) {
        var highchart = chart;
        if (highchart.options.plotOptions.series.stacking === 'normal') {  
          highchart.options.plotOptions.series.stacking = null  
        } else {  
          highchart.options.plotOptions.series.stacking = 'normal' ;
        }
        return highchart;
      },
      swapChartType: function(chart) {
        var highchart = chart;
        if (highchart.options.chart.type === 'line') {
          highchart.options.chart.type = 'column';
          highchart.options.plotOptions.series.stacking = 'normal' ;
          return '<i class="fa fa-bar-chart"></i>';
        } else {
          highchart.options.chart.type = 'line';
          highchart.options.plotOptions.series.stacking = null
          return '<i class="fa fa-line-chart"></i>';
        }
        return highchart;
      }
    }
  }
);