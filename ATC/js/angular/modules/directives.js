
directives = angular.module('directives', []);


directives.service('helperService', function() {
  var helperService = {};

  helperService.isTablet = function() {
    var width = window.innerWidth;
    return width < 1100;
  }
  
  helperService.generateRandomColor = function() {
    var r = parseInt(helperService.generateRandomInteger(255));
    var g = parseInt(helperService.generateRandomInteger(255));
    var b = parseInt(helperService.generateRandomInteger(255));
    return r + "," + g + "," + b;
  }

  helperService.generateRandomInteger = function(max) {
    var rand = parseInt(Math.random() * max);
    return rand;
  }

  helperService.degreesToRadians = function(degrees) {
    return (Math.PI / 180) * degrees;
  }
  
  return helperService;
});


directives.animation('.view-slide-bottom', function () {
  return {
    enter: function(element, done) {
      element.css({
        opacity: 0.5,
        position: "relative",
        top: "10px",
        left: "20px"
      })
      .animate({
        top: 0,
        left: 0,
        opacity: 1
        }, 1000, done);
    }
  };
});


directives.directive("ccGrid", function() {
  return {
    replace: false,
    restrict: "EA",
    template: '<canvas class="backcanvas" ng-init="init()" width="{{width}}" height="{{height}}" style="position: fixed"/>',

    scope: {
      width: "@width",
      height: "@height",
      majorLineColor: "@major",
      minorLineColor: "@minor",
      gridAlpha: "=?alpha",
    },

    link: function($scope, element, attrs) {
      $scope.element = element;
      $scope.attrs = attrs;  

      $scope.$watch('gridAlpha', function(newValue, oldValue) {
        $scope.setCanvasDimensions();
      });
    },

    controller: function($scope, $timeout, helperService) {

      $scope.init = function() {
        $timeout($scope.setCanvasDimensions);
        
        if($scope.height == null) {
          $(window).resize(function() {
            $scope.setCanvasDimensions();
          }); 
        }      
      };
      
      $scope.setCanvasDimensions = function() {
        if($scope.canvas == null) {
          $scope.canvas =  $scope.element.find('canvas')[0];
        }
        
        if($scope.height == null) {
          $scope.canvas.width = window.innerWidth;
          $scope.canvas.height = window.innerHeight;
          console.log("resize " + $scope.canvas.width + ":" + $scope.canvas.height);
        }

        $scope.drawGrid();
      }
      
      $scope.drawGrid = function() {
        if($scope.canvas != undefined) {
          var ctx = $scope.canvas.getContext("2d");
          var w = $scope.canvas.width;
          var h = $scope.canvas.height;
          var x = 0.5;
          var y = 0.5; 
          var spacing = 10;
          var clr;
          var hLines = h / spacing;
          var vLines = w / spacing;
          var center = {"x" : w/2, "y" : h/2};
          $scope.majorLineColor = $scope.majorLineColor || "#aaaaaa"; //default
          $scope.minorLineColor = $scope.minorLineColor || "#eeeeee"; //default
          $scope.gridAlpha = $scope.gridAlpha || "1"; //default  

          ctx.clearRect(0, 0, w, h);
          ctx.lineWidth = 1;
          ctx.globalAlpha = $scope.gridAlpha;
          
          //draw the vertical lines
          for(var v = 0; v < vLines; v++) {
            clr = $scope.minorLineColor;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.strokeStyle = clr;
            ctx.stroke();
            x += spacing;
          }
          
          //draw the horizontal lines
          for(var m = 0; m < hLines; m++) {
            clr = $scope.minorLineColor;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.strokeStyle = clr;
            ctx.stroke();
            y += spacing;
          }

          x = 0.5;
          y = 0.5; 

          //draw the Major vertical lines
          for(var v = 0; v < vLines; v++) {
            if(v > 0 && v % 10 == 0) {
              clr = $scope.majorLineColor;
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, h);
              ctx.strokeStyle = clr;
              ctx.stroke();
            }

            x += spacing;
          }
          
          //draw the Major horizontal lines
          for(var m = 0; m < hLines; m++) {
            if(m > 0 && m % 10 == 0) {
              clr = $scope.majorLineColor;
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(w, y);
              ctx.strokeStyle = clr;
              ctx.stroke();
            }

            y += spacing;
          }
        }
      }
    }
  }
});




directives.directive("ccPeacockLoader", function() {
  return {
    replace: false,
    restrict: "EA",
    template: '<canvas ng-init="init()" ng-click="toggleContinue()" style="z-index: 10"/><table class="absoluteCentered" style="width: 100%; height: 100%;"><tr><td class="homeLoading" ng-click="toggleContinue()">Loading</td></tr></table>',

    scope: {
      width: "@width",
      height: "@height",
      slices: "@slices",
      animate: "=animate"
    },

    link: function($scope, element, attrs) {
      $scope.element = element;
      $scope.attrs = attrs;
      $scope.canvas = $scope.element.find('canvas')[0];
      $scope.rotation = 0;
      $scope.offsetX = 40;
      $scope.offsetY = 20;
      $scope.motionBlur = false;
      $scope.drawRate = 10;
      $scope.rotationIncrement = -1;
      $scope.sliceRotator = 1;
      $scope.drawShadow = false;
      $scope.sliceWidth = 26;
      $scope.sliceHeight = 110;
      $scope.sliceCurveFactor = 30;
      $scope.offsetIncrement = .1;
      $scope.shadowBlur = 30;
      $scope.shadowOffsetY = 15;
      $scope.shadowOffsetX = 5;
      $scope.shadowColor = '#111';

      $scope.configurableProps = [ //used for the  configuration control
        {"name": "drawShadow", "displayName": "Render Shadow", "type": "boolean"},
        {"name": "motionBlur", "displayName": "Motion Blur", "type": "boolean"},
        {"name": "animate", "displayName": "Animate", "type": "boolean"},
        {"name": "sliceCurveFactor", "displayName": "Slice Curve Factor", "type": "int"},
        {"name": "slices", "displayName": "Slices", "type": "int"},
      ];
    },

    controller: function($scope, $timeout, helperService) {

      $scope.init = function() {
        $scope.initSlices();

        $timeout(function() {
          $scope.setDimensions();
        });

        $(window).resize(function() {
          $scope.setDimensions();
        });

        $scope.$watch('slices', function(newValue, oldValue) {
          $scope.initSlices();
        });

        $scope.$watch('animate', function(newValue, oldValue) {
          if($scope.animate) {
            $scope.draw();
          }
        });
      }

      $scope.setDimensions = function() {
        $scope.w = $scope.element.width();
        $scope.h = $scope.element.height();
        $scope.canvas.width = $scope.w;
        $scope.canvas.height = $scope.h;
      }

      $scope.toggleContinue = function() {
        //$scope.animate = !$scope.animate;
      }

      $scope.initSlices = function() {
        $scope.colors = ['rgb(243, 187, 42)', 'rgb(236, 64, 40)', 'rgb(171, 31, 34)', 'rgb(106, 83, 173)', 'rgb(66, 151, 218)', 'rgb(119, 188, 72)'];
        $scope.slicesArr = [];

        if($scope.slices == undefined) {
          $scope.slices = 6;
        }

        for(var i = 0; i < $scope.slices; i++) {
          var slice = {"id" : "slice _" + i};
          var c = i % $scope.colors.length
          slice.color = $scope.colors[c];
          $scope.slicesArr.push(slice);
        }
      }

      $scope.drawSlice = function(ctx, slice, length, thickness, bz, offsetX, offsetY) {   
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        ctx.lineTo(-thickness, length);
        ctx.bezierCurveTo(-thickness+5, length+bz, thickness-5, length+bz, thickness, length);
        ctx.lineTo(offsetX, offsetY);
        ctx.closePath();
        ctx.fillStyle = slice.color;

        if(!helperService.isTablet()) {
          ctx.shadowColor = $scope.shadowColor;
          ctx.shadowBlur = $scope.shadowBlur;
          ctx.shadowOffsetX = $scope.shadowOffsetX;
          ctx.shadowOffsetY = $scope.shadowOffsetY;
        }

        ctx.fill();
      }

      $scope.draw = function() {
        if($scope.canvas != undefined && $scope.animate == true) {
          var ctx = $scope.ctx = $scope.canvas.getContext("2d");
          var w = $scope.element.width();
          var h = $scope.element.height();
          var r = w/2;
          $scope.center = {"x" : w/2, "y" : h/2};

          if($scope.motionBlur) {
            $scope.ctx.fillStyle = "rgba(255, 255, 255, .3)";
            $scope.ctx.fillRect(0, 0, w, h);
          }
          else {
            ctx.clearRect(0, 0, w, h);
          }

          ctx.save();
          ctx.translate($scope.center.x,  $scope.center.y);          
          ctx.rotate(helperService.degreesToRadians($scope.rotation));

          var angle = 0;
          var inc = 360 / $scope.slicesArr.length;

          for(var i = 0; i < $scope.slicesArr.length; i++) {
            var slice = $scope.slicesArr[i];
            ctx.save();
            var radians = helperService.degreesToRadians(angle);
            ctx.rotate(radians);
            $scope.drawSlice(ctx, slice, $scope.sliceHeight, $scope.sliceWidth, $scope.sliceCurveFactor, $scope.offsetX, $scope.offsetY);
            angle -= inc;
            ctx.restore();
          }

          $scope.rotation += $scope.rotationIncrement;
          $timeout($scope.draw, $scope.drawRate);
          ctx.restore();
        }
      }
    }
  }
});




directives.directive("ccPeacockGauge", function() {
  return {
    replace: false,
    restrict: "EA",
    template: '<img src="images/comcast_trans_gauge_100.png" ng-init="init()" style="bottom: 10px; position: relative; opacity: .5"/><div class="needletext">Happy Index: {{value}}%</div><img src="images/peacock_needle_blur.png" class="needlebase" ng-style="styleNeedle()">',

    scope: {
      value: "=value"
    },

    link: function($scope, element, attrs) {
      $scope.element = element;
      $scope.attrs = attrs;
      $scope.needle = $scope.element.find('.needlebase')[0];
    },

    controller: function($scope, $timeout, helperService) {
      $scope.init = function() {
        $timeout(function() {
          $scope.setDimensions();
        });
      }

      $scope.animateNeedle = function() {
        $scope.v = (parseInt($scope.value) / 100) * 180 - 90;
        $($scope.needle).css("transform", "rotate(" + $scope.v + "deg)");
      }
      
      $scope.styleNeedle = function() {
        var obj = {
          "position" : "absolute",
          "left" : $scope.w / 2 - 12,
          "bottom" : 30,
          "height" : 75,
          "width" : 24,
          "transform-origin" : "bottom center"
        }

        $timeout(function() {
          $scope.animateNeedle();
        }, 5000);

        return obj;
      }

      $scope.setDimensions = function() {
        $scope.w = $scope.element.width();
        $scope.h = $scope.element.height();
      }
    }
  }
});




