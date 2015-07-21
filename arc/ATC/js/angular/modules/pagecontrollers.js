
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

  dataService.criticalColor = "255, 0, 0";
  dataService.badColor = "255, 165, 0";
  dataService.neutralColor = "255, 255, 0";
  dataService.goodColor = "0, 255, 0";

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

  $scope.$on('mapInitialized', function(evt, map) {
    if(dataService.latLng != undefined) {
      map.panTo(dataService.latLng);
      map.setZoom(10);

      var clr;

      if(dataService.zoneColor == "critical") {
        clr = "rgb(" + dataService.criticalColor + ")";
      }
      else if(dataService.zoneColor == "bad") {
        clr = "rgb(" + dataService.badColor + ")";
      }
      else if(dataService.zoneColor == "neutral") {
        clr = "rgb(" + dataService.neutralColor + ")";
      }
      else if(dataService.zoneColor == "good") {
        clr = "rgb(" + dataService.goodColor + ")";
      }

      var populationOptions = {
        strokeColor: clr,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: clr,
        fillOpacity: 0.3,
        map: map,
        center: dataService.latLng,
        radius: 20000
      };

      cityCircle = new google.maps.Circle(populationOptions);
    }
  });

 $scope.restoreCards = function() {
    dataService.latLng = null;
    dataService.zoneColor = null;
    dataService.transitionClass = "view-animate-backward";
    dataService.loading = false;
    top.location = "#/summary";
  }
});



///////////////////////  SUMMARY CONTROLLER //////////////////////////////////////


app.controller("SummaryCtrl", function ($scope, dataService, $timeout, dataService) {
  $scope.views = summaryData;

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
    dataService.zoneColor = this.note.catagory 
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
      bg = dataService.criticalColor;
    }
    else if(note.catagory == "bad") {
      bg = dataService.badColor;
    }
    else if(note.catagory == "neutral") {
      bg = dataService.neutralColor;
    }
    else if(note.catagory == "good") {
      bg = dataService.goodColor;
    }
    else {
      return null;
    }

    return {"background-color" :  "rgba(" + bg + ", .3)"};
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
