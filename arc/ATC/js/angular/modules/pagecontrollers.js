
var app = angular.module('AppModule', ['ngMap','ngResource', 'ngRoute', 'ngAnimate', 'directives']);


//////////////////////  SERVICES  //////////////////////////////////////

app.service('dataService', function() {
  var dataService = {};
  dataService.viewReady = false;
  dataService.loading = false;
  dataService.showCards = false;
  dataService.loginReady = false;
  dataService.animateNeedle = true;
  dataService.transitionClass = "";
  dataService.pageTitle = "Executive Briefing";

  dataService.bounds = [
    [34.0019, -118.4814],
    [34.202234, -118.143684]
   ] ;

  return dataService;
});


app.config(function ($routeProvider) {
  $routeProvider
    .when('/:page', {templateUrl: function(params) {
        return params.page + ".html";
      }
    })
    
    .otherwise({redirectTo: '/splash'});
}); 


//////////////////////  ROUTE CONTROLLER  ////////////////////////////////////// 


app.controller("RouteController", function RouteController($rootScope, $scope, $location, $timeout, dataService) {
  $scope.dataService = dataService;

  $scope.$on('$locationChangeStart', function(event, next, current) { 
    var path = $location.path();
    path = path.substring(1, path.length);  
  });
  
  $scope.$on('$routeChangeError', function (event, args) {
    var path = $location.path();
    path = path.substring(1, path.length);
  });

  $scope.$on('locationChangeSuccess', function (event, args) {
    var path = $location.path();
    path = path.substring(1, path.length);
  });
});



///////////////////////  LOGIN CONTROLLER //////////////////////////////////////


app.controller("LoginCtrl", function ($scope, dataService, $timeout, dataService, helperService) {

  $scope.init = function() {
    dataService.loginReady = false;

    $timeout(function () {
      dataService.loginReady = true;
    }, 5000);
  }

  $scope.login = function() {
    $scope.goForward();
  }

  $scope.goForward = function() {
    dataService.transitionClass = "view-animate-forward";
    dataService.viewReady = false;
    dataService.showCards = false;
    dataService.loginReady = false;

    //$timeout(function () {
      dataService.loading = true;
    //}, 1000);

    $timeout(function () {
      top.location = "#/summary";
    });
  }
});


///////////////////////  MAP CONTROLLER //////////////////////////////////////


app.controller("MapCtrl", function ($scope, dataService, $timeout, dataService) {
  $scope.init = function() {
    dataService.viewReady = true;

    $timeout(function () {
    }, 1000);

    $timeout(function () {
      dataService.showCards = true;
      dataService.loading = false;
    }, 4000);
  }

  $scope.$on('mapInitialized', function(evt, evtMap) {
    dataService.mapInstance = evtMap;

    if(dataService.latLng != undefined) {
        dataService.mapInstance.panTo(dataService.latLng);
        dataService.mapInstance.setZoom(10);

        //draw a circle
    }
  });

 $scope.restoreCards = function() {
    dataService.latLng = null;
    dataService.transitionClass = "view-animate-backward";
    dataService.loading = false;
    top.location = "#/summary";
  }
});



///////////////////////  SUMMARY CONTROLLER //////////////////////////////////////


app.controller("SummaryCtrl", function ($scope, dataService, $timeout, dataService) {
  $scope.criticalColor = "rgba(255, 0, 0, 0.33)";
  $scope.badColor = "rgba(255, 165, 0, 0.33)";
  $scope.neutralColor = "rgba(255, 255, 0, 0.33)";
  $scope.goodColor = "rgba(0, 255, 0, 0.33)";

  $scope.views = [
    {"name" : "West", "color" : "#7AA6D2", "value" : "25", "notes": [
      {"lat" : 34.0219, "long": -118.4814, "title" : "Santa Monica Outage", "description" : "Main line rupture due to construction in the area", "catagory" : "critical"},
      {"lat" : 34.0219, "long": -118.4814,  "title" : "Santa Monica Outage", "description" : "Main line rupture due to construction in the area", "catagory" : "critical"},
      {"lat" : 34.0219, "long": -118.4814,  "title" : "Santa Monica Outage", "description" : "Main line rupture due to construction in the area", "catagory" : "bad"},
      {"lat" : 34.0219, "long": -118.4814,  "title" : "Santa Monica Outage", "description" : "Main line rupture due to construction in the area", "catagory" : "bad"},
      {"lat" : 34.0219, "long": -118.4814,  "title" : "Santa Monica Outage", "description" : "Main line rupture due to construction in the area", "catagory" : "neutral"},
      {"lat" : 34.0219, "long": -118.4814,  "title" : "Santa Monica Outage", "description" : "Main line rupture due to construction in the area", "catagory" : "neutral"},
      {"lat" : 34.0219, "long": -118.4814,  "title" : "Los Angeles", "description" : "Everyting looks good with the network migration", "catagory" : "good"}
      ]},
    {"name" : "Central", "color" : "#C26FA1", "value" : "75", "notes": [
      {"lat" : 39.0997, "long": -94.5783,  "title" : "St. Louis", "description" : "Main line rupture due to construction in the area", "catagory" : "good"},
      {"lat" : 39.0997, "long": -94.5783,  "title" : "Kanasas City", "description" : "Main line rupture due to construction in the area", "catagory" : "good"},
      {"lat" : 39.0997, "long": -94.5783,  "title" : "De Moines", "description" : "Everyting looks good with the network migration", "catagory" : "good"}
      ]}, 
    {"name" : "North East", "color" : "#C26F6F", "value" : "43", "notes": [
      {"lat" : 42.6525, "long": -73.7572,  "title" : "Albany Outage", "description" : "Main line rupture due to construction in the area", "catagory" : "bad"},
      {"lat" : 42.6525, "long": -73.7572,  "title" : "Albany Outage", "description" : "Main line rupture due to construction in the area", "catagory" : "neutral"},
      {"lat" : 42.6525, "long": -73.7572,  "title" : "Albany Outage", "description" : "Main line rupture due to construction in the area", "catagory" : "good"},
      {"lat" : 42.6525, "long": -73.7572,  "title" : "Syracuse", "description" : "Everyting looks good with the network migration", "catagory" : "good"}
      ]}
  ];

  $scope.init = function() {
    dataService.viewReady = true;
    dataService.pageTitle = "Executive Briefing";

    $timeout(function () {
      dataService.showCards = true;
      dataService.loading = false;
    }, 4000);
  }

  $scope.showMoreInfo = function() {
    var lat = this.note.lat;
    var long = this.note.long;
    var latLng = new google.maps.LatLng(lat, long);
    dataService.latLng = latLng;
    dataService.transitionClass = "view-animate-forward";
    dataService.pageTitle = this.note.title;
    dataService.loginReady = false;
    dataService.loading = false;

    $timeout(function () {
      top.location = "#/map";
    }, 100);
  }

  $scope.getNoteStyle = function() {
    var note = this.note;
    var bg;

    if(note.catagory == "critical") {
      bg = $scope.criticalColor;
    }
    else if(note.catagory == "bad") {
      bg = $scope.badColor;
    }
    else if(note.catagory == "neutral") {
      bg = $scope.neutralColor;
    }
    else if(note.catagory == "good") {
      bg = $scope.goodColor;
    }
    else {
      return null;
    }

    return {"background-color" :  bg};
  }

  $scope.goBack = function() {
    dataService.showCards = false;
    dataService.transitionClass = "view-animate-backward";
    
    $timeout(function () {
      $timeout(function () {
        dataService.viewReady = false;
      }, 100);

      top.location = "#/splash";
    });
  }
});
