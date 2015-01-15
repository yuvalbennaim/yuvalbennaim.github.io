  
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
    dataService.viewShowing = false;
    dataService.animateBubbles = true;
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
    $scope.dataService.currentPage = "";
   
    $scope.$on('$locationChangeStart', function(event, next, current) { 
      var path = $location.path();
      path = path.substring(1, path.length);      

      if($scope.dataService.currentPage != path) {
        $scope.dataService.previousPage = $scope.dataService.currentPage;
        $scope.dataService.currentPage = path;

        if(path == "home") {
          dataService.viewShowing = false;
          dataService.transitionClass = "view-animate-backward";
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
    $scope.dataService = dataService;

    $scope.init = function() {
    }
  };


  ///////////////////////  RESUME CONTROLLER //////////////////////////////////////
  

  function SkillsCtrl($scope, $injector, $http, $timeout, dataService) {
    $injector.invoke(CommonCtrl, this, {$scope: $scope}); 
    $scope.dataService = dataService;

    $scope.init = function() {
      $scope.dataService.skills = window.skillsData;
    }

    $scope.generateBarStyle = function() {
      var bg = "rgba(" + this.skill.color + " , .5)";
      var w = parseInt(this.skill.score) * 10 + "%";
      return {"background-color" :  bg, "width" : w}
    }
    
  };

  ///////////////////////  PORTFOLIO CONTROLLER //////////////////////////////////////
  

  function PortfolioCtrl($scope, $injector, $http, $timeout, dataService) {
    $injector.invoke(CommonCtrl, this, {$scope: $scope}); 
    $scope.dataService = dataService;
    $scope.sorter = 'name';
    $scope.search = '';

    $scope.init = function() {
      $scope.getGitRepositoryData();
    }

    $scope.init = function() {
      $scope.getGitRepositoryData();
    }

    $scope.viewItem = function() {
      $scope.dataService.selected = this.slide;

      $timeout(function () {
        top.location = "#/item";
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
              $scope.dataService.slides[s].text = $scope.dataService.slides[s].name;
            }
          }).
          error(function(data, status, headers, config) {
            console.log("error" + data);
            $scope.dataService.error = true;
          });
      }
    }
  };