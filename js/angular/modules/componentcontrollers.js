
var app = angular.module('AppModule', ['helperModule', 'chart.js']);


//////////////////////  SERVICES  //////////////////////////////////////

app.service('dataService', function() {
  var dataService = {};
  dataService.showGrid = true;
  dataService.showMonitor = true;
  dataService.viewShowing = false;
  dataService.animateBubbles = true;
  dataService.showSettings = false;
  dataService.cpuData;
  dataService.cpuBeatInterval = 1000;
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

  $scope.options = {"animation":false, "showScale":true, "showTooltips":false, "pointDot":false, "datasetStrokeWidth":2};

  $scope.init = function() {
    $scope.labels = [];

    for (var i = 0; i < dataService.cpuData[0].length; i++) {
      dataService.cpuData[1][i] = 20 + parseInt(helperService.generateRandomInteger(10));
      $scope.labels.push("");
    };

    $scope.cpuBeat();
  }

  $scope.cpuBeat = function() {
    dataService.cpuData[0].push(dataService.cpuData[0].shift());    
    dataService.cpuData[1].push(dataService.cpuData[1].shift());
    $timeout($scope.cpuBeat, dataService.cpuBeatInterval);
  }
});
