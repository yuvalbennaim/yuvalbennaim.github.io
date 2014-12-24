  
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

  app.service('GitFactory', function($resource) {
    //useage for object: var result = GitFactory.get(); 
    //useage for array: var result = GitFactory.query(); 
    return $resource('js/mockdata.json');
  });

  app.service('dataService', function() {
    var dataServiceInstance = {};
    dataServiceInstance.transitionClass = "view-animate-forward";
    dataServiceInstance.gitPath = "https://api.github.com/repos/yuvalbennaim/git/contents/Portfolio";
    dataServiceInstance.name = "Yuval";
    dataServiceInstance.lastname = "Bennaim";
    dataServiceInstance.slides = [];
    dataServiceInstance.mockData;
    dataServiceInstance.pageLoading = true;
    dataServiceInstance.error = false;
    return dataServiceInstance;
  });

  app.provider('$dataProvider', function() {
    this.name = "Yuval";
    this.lastname = "Bennaim";

    this.$get = function() {
      return this.name + " " + this.lastname;
    };
  });
  
  
  //////////////////////  ROUTE CONTROLLER  ////////////////////////////////////// 


  function RouteController($scope, $location, $timeout, dataService) {
    $scope.dataService = dataService;
   
    $scope.$on('$locationChangeStart', function(next, current) { 
      var path = $location.path();
      path = path.substring(1, path.length);

      if(path == "portfolio") {
        $scope.dataService.transitionClass = "view-animate-backward";
      }
      else {
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
  }
  
  
  //////////////////////  COMMON FUNCTIONS  ////////////////////////////////////// 
  
  
  function CommonCtrl($scope) {
    $scope.$emit('routeLoaded', {});
  };
  
  
  ///////////////////////  HOME CONTROLLER //////////////////////////////////////
  

  function HomeCtrl($scope, $injector, $http, $timeout, dataService, GitFactory, $dataProvider) {
    $injector.invoke(CommonCtrl, this, {$scope: $scope}); 
    $scope.dataService = dataService;

    $scope.init = function() {
      $scope.dataService.mockData = GitFactory.query();
      $scope.dataProviderOutput = $dataProvider
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
              $scope.dataService.slides[s].localImage = "/images/" + $scope.dataService.slides[s].name;
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