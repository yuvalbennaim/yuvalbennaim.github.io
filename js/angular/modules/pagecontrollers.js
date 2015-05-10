  
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
    dataService.showGrid = true;
    dataService.pageLoading = true;
    dataService.viewShowing = false;
    dataService.animateBubbles = true;
    dataService.showSettings = false;
    dataService.gridAlpha = .2;
    dataService.bubblesAlpha = .2;
    dataService.transitionClass = "view-animate-forward";
    dataService.gitPath = "https://api.github.com/repos/yuvalbennaim/yuvalbennaim.github.io/contents/images/Portfolio";
    dataService.slides = [];

    var width = screen.width;
    var height = screen.height;
    dataService.mobile = width < 1000;
    dataService.orientation = (width > height) ? "landscape" : "portrait";

    /*add all the graphics params here*/
    
    return dataService;
  });
  
  
  //////////////////////  ROUTE CONTROLLER  ////////////////////////////////////// 


  function RouteController($rootScope, $scope, $location, $timeout, dataService) {
    $scope.dataService = dataService;
    $scope.dataService.previousPage = "";
    $scope.dataService.currentPage = null;
   
    $scope.$on('$locationChangeStart', function(event, next, current) { 
      var path = $location.path();
      path = path.substring(1, path.length);      

      if($scope.dataService.currentPage != path) {
        $scope.dataService.previousPage = $scope.dataService.currentPage;
        $scope.dataService.currentPage = path;

        if(path == "home") {
          //dataService.viewShowing = false;
          dataService.transitionClass = "view-animate-backward";

          // $timeout(function () {
          //   dataService.viewShowing = true;
          // }, 5000);
        }
        else {
          dataService.viewShowing = true;
          dataService.transitionClass = "view-animate-forward";
        }

        console.log("routeChangeStart: " + path);
        $scope.dataService.pageLoading = true;
      }
      else {
        console.log("same path: " + $scope.dataService.currentPage);
        /*to fix*/
        $scope.dataService.currentPage = "";
        event.preventDefault();
      }
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

    $scope.stopAnimation = function() {
      dataService.animateBubbles = !dataService.animateBubbles;
    }

    $scope.toggleSettings = function() {
      dataService.showSettings = !dataService.showSettings;
    }

    $scope.goBack = function() {
      $scope.search = "";
      $scope.dataService.selected = null;
      dataService.transitionClass = "view-animate-backward";

      $timeout(function () {
        top.location = "/#" + $scope.dataService.previousPage;
      });
    }

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
    $scope.predicate = '-date_to';

    $scope.init = function() {
      dataService.jobs = window.jobData;
    }
  };


  ///////////////////////  RESUME CONTROLLER //////////////////////////////////////
  

  function SkillsCtrl($scope, $injector, $http, $timeout, dataService) {
    $injector.invoke(CommonCtrl, this, {$scope: $scope}); 
    dataService.scale = [1,2,3,4,5,6,7,8,9,10];
    $scope.predicate = '-score';

    var helperService = $injector.get('helperService');
    var randColor = helperService.generateRandomColor();

    $scope.init = function() {
      dataService.skills = window.skillsData;
    }

    $scope.getScaleClass = function() {
      var unit = parseInt(this.unit);
      console.log(this.unit + ' getScaleClass ' + unit);
      
      if(dataService.currentMarker == unit) {
        return 'scaleUnitLabelSelected';
      }
      else {
        return 'scaleUnitLabel';
      }
    }

    $scope.generateBarStyle = function() {
      var bg = "rgba(" + this.skill.color + " , .3)";
      var w = parseInt(this.skill.score * 10) + "%";
      return {"background-color" :  bg, "width" : w}
    }

    
    $scope.generateMarkerStyle = function() {
      if(dataService.currentMarker == null) {
        return null;
      }
      else {
        var offset = parseInt((dataService.currentMarker-1) * 10) + "%";
        return {"left" : offset}
      }
    }
  };

  ///////////////////////  PORTFOLIO CONTROLLER //////////////////////////////////////
  

  function PortfolioCtrl($scope, $injector, $http, $timeout, dataService) {
    $injector.invoke(CommonCtrl, this, {$scope: $scope}); 
    $scope.sorter = 'name';
    $scope.search = '';

    $scope.init = function() {
      $scope.getGitRepositoryData();
    }

    $scope.init = function() {
      $scope.getGitRepositoryData();
    }

    $scope.viewItem = function() {
      dataService.selected = this.slide;

      $timeout(function () {
        top.location = "#/item";
      });
    }

    $scope.getGitRepositoryData = function() { 
      if(dataService.slides.length == 0) {
        var url = dataService.gitPath;
        dataService.error = false;
        dataService.contentList = null;

        $http.get(url).
          success(function(data, status, headers, config) {
            dataService.slides = data;

            for(var s = 0; s < dataService.slides.length; s++) {
              dataService.slides[s].text = dataService.slides[s].name;
            }
          }).
          error(function(data, status, headers, config) {
            console.log("error" + data);
            dataService.error = true;
          });
      }
    }
  };