
var app = angular.module('AppModule', ['helperModule', 'chart.js', 'yuvalsDirectives']);


//////////////////////  SERVICES  //////////////////////////////////////

app.service('dataService', function() {
  var dataService = {};
  dataService.showGrid = true;
  dataService.showMonitor = true;
  dataService.viewShowing = false;
  dataService.animateBubbles = true;
  dataService.bezierCurve = true;
  dataService.showSettings = false;
  dataService.cpuData;
  dataService.cpuBeatInterval = 1000;
  dataService.cpuAverage = 50;
  return dataService;
});


//////////////////////  CONTROLLER  ////////////////////////////////////// 


app.controller('ChartController', function ($scope, $timeout, dataService, helperService) {
  $scope.dataService = dataService;
  $scope.labels = ["", "", "", "", "", "", ""];
  $scope.series = ['', ''];
  dataService.cpuData = [
    [0,10,20,30,40,50,100,100,100,100,100,97,96,94,99,94,96,98,97,97,92,97,95,92,93,91,90,88,88,89,90,90,94,98,96,95,99,96,94,98,100,100,96,94,97,100,90,87,84,84,88,86,83,83,84,88,88,85,88,86,87,83,82,78,77,78,77,80,82,85,89,91,93,90,92,92,88,87,89,92,96,94,96,94,89,92,89,92,88,88,87,88,92,95,93,92,91,90,94,98,99,97,95,91,90,93,92,89,85,80,81,78,73,70,67,60,66,65,65,54,54,33,32,30,33,32,37,38,42,45,47,49,50,40,20],
    []
  ];

  $scope.options = {"animation":false, "scaleShowGridLines" : false, "showScale":true, "showTooltips":false, "pointDot":false, "datasetStrokeWidth":2, "bezierCurve": dataService.bezierCurve};

  $scope.init = function() {
    $scope.labels = [];

    for (var i = 0; i < dataService.cpuData[0].length; i++) {
      dataService.cpuData[1][i] = 20;
      $scope.labels.push("");
    };

    $scope.cpuBeat();
  }

  $scope.calculateRunningAverage = function() {
    var total = 0;

    for(var i = 1; i <= dataService.cpuAverage; i++) {
      var index = dataService.cpuData[0].length - i;
      total += dataService.cpuData[0][index];
    };
   
    dataService.cpuData[1].shift(); 
    dataService.cpuData[1].push(parseInt(total / dataService.cpuAverage)); 
  }

  $scope.cpuBeat = function() {
    dataService.cpuData[0].push(dataService.cpuData[0].shift());    
    $scope.calculateRunningAverage();
    $timeout($scope.cpuBeat, dataService.cpuBeatInterval);
  }

   $scope.zoomTest = function() {
    dataService.cpuData[0] = [0,10,20,30,40,50,100,100,100,100,100,97,96,94,99,94,96,98,97,97,92,97];
    dataService.cpuData[1] = [0,10,20,30,40,50,100,100,100,100,100,97,96,94,99,94,96,98,97,97,92,97];

    $scope.labels = [];

    for (var i = 0; i < dataService.cpuData[0].length; i++) {
      $scope.labels.push(".");
    };
  }
});

