  
  var app = angular.module('AppModule', ['ngResource', 'ngRoute', 'ngAnimate', 'yuvalsDirectives']);
  app.controller('RouteController', RouteController); 

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/:page', {templateUrl: function(params) {
          return params.page + ".html";
        }
      })
      
      .otherwise({redirectTo: '/home'});
  }); 

  app.service('dataService', function() {
    var dataService = {};
    dataService.showGrid = false;
    dataService.viewReady = false;
    dataService.animateBubbles = true;

    var width = screen.width;
    var height = screen.height;
    dataService.mobile = width < 1000;
    dataService.orientation = (width > height) ? "landscape" : "portrait";

    /*add all the graphics params here*/
    
    return dataService;
  });
  
  
  //////////////////////  ROUTE CONTROLLER  ////////////////////////////////////// 


  function RouteController($scope, $location, $timeout, dataService) {
    $scope.dataService = dataService;
   
    $scope.$on('$locationChangeStart', function(next, current) { 
      var path = $location.path();
      path = path.substring(1, path.length);

      if(path == "home") {
        dataService.viewReady = false;
        dataService.animateBubbles = true;
        $scope.dataService.transitionClass = "view-animate-backward";
      }
      else {
        dataService.viewReady = true;
        dataService.animateBubbles = false;
        $scope.dataService.transitionClass = "view-animate-forward";
      }

      console.log("routeChangeStart: " + path);
      $scope.dataService.pageLoading = true;
    });
    
    $scope.$on('$routeChangeError', function (event, args) {
      var path = $location.path();
      path = path.substring(1, path.length);
      $scope.page = path;
      console.log("Page " + $scope.page + " not found !");
    });

    $scope.$on('routeLoaded', function (event, args) {
      var path = $location.path();
      path = path.substring(1, path.length);
      $scope.page = path;
      console.log("routeLoaded: " + $scope.page);

      $timeout(function () {
        $scope.dataService.pageLoading = false;
      }, 2000);
    });

    $scope.viewPage = function(url) {
      top.location = url;
    }

    $scope.toggleContinue = function() {
      $scope.dataService.animateBubbles = !$scope.dataService.animateBubbles;
    }
  }
  
  
  //////////////////////  COMMON FUNCTIONS  ////////////////////////////////////// 
  
  
  function CommonCtrl($scope) {
    $scope.$emit('routeLoaded', {});
  };
  
  
  ///////////////////////  RESUME CONTROLLER //////////////////////////////////////
  

  function ResumeCtrl($scope, $injector, $http, $timeout, dataService) {
    $injector.invoke(CommonCtrl, this, {$scope: $scope}); 
    $scope.dataService = dataService;

    $scope.init = function() {
    }
  };


  ///////////////////////  RESUME CONTROLLER //////////////////////////////////////
  

  function SkillsCtrl($scope, $injector, $http, $timeout, dataService) {
    $injector.invoke(CommonCtrl, this, {$scope: $scope}); 
    $scope.dataService = dataService;

    $scope.init = function() {
    }
  };

  ///////////////////////  PORTFOLIO CONTROLLER //////////////////////////////////////
  

  function PortfolioCtrl($scope, $injector, $http, $timeout, dataService) {
    $injector.invoke(CommonCtrl, this, {$scope: $scope}); 
    $scope.dataService = dataService;
    $scope.sorter = 'name';
    $scope.search = '';

    $scope.init = function() {
      //$scope.getGitRepositoryData();
    }

    /*
    $scope.init = function() {
      $scope.getGitRepositoryData();
    }

    $scope.viewItem = function() {
      $scope.dataService.selected = this.slide;

      $timeout(function () {
        top.location = "#/item";
      });
    }

    $scope.backToPortfolio = function() {
      $scope.search = "";
      $scope.dataService.selected = null;

      $timeout(function () {
        top.location = "#/portfolio";
      });
    }

    $scope.getGitRepositoryData = function() { 
      if($scope.dataService.slides.length == 0) {
        var url = $scope.dataService.gitPath;
        $scope.dataService.error = false;
        $scope.dataService.contentList = null;

        $http.get(url).
          success(function(data, status, headers, config) {
            $scope.dataService.slides = data;

            for(var s = 0; s < $scope.dataService.slides.length; s++) {
              $scope.dataService.slides[s].image = $scope.dataService.slides[s].download_url;
              $scope.dataService.slides[s].text = $scope.dataService.slides[s].name;
            }
          }).
          error(function(data, status, headers, config) {
            console.log("error" + data);
            $scope.dataService.error = true;
          });
      }
    }*/
  };