
yuvalsDirectives = angular.module('yuvalsDirectives', []);


yuvalsDirectives.service('helperService', function() {
    var helperService = {};
    
    helperService.generateRandomColor = function() {
      var r = parseInt(Math.random() * 255);
      var g = parseInt(Math.random() * 255);
      var b = parseInt(Math.random() * 255);
      return r + "," + g + "," + b;
    }
    
    return helperService;
  });


yuvalsDirectives.directive("ybGrid", function() {
  return {
    replace: false,
    restrict: "EA",
    template: '<canvas class="backcanvas" ng-init="init()" width="{{width}}" height="{{height}}" style="position: fixed"/>',

    scope: {
      width: "@width",
      height: "@height"
    },

    link: function($scope, element, attrs) {
      $scope.element = element;
      $scope.attrs = attrs;
      $scope.majorLineColor = "#444";
      $scope.minorLineColor = "#222";
      $scope.centerLineColor = "#f00";
      $scope.circleColor = "#6DAEDF";
      $scope.gridAlpha = .2;
    },

    controller: function($scope, $timeout, dataService) {
      $scope.dataService = dataService;

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

          ctx.clearRect(0, 0, w, h);
          ctx.lineWidth = 1;
          ctx.globalAlpha = $scope.gridAlpha;
          
          //draw the vertical lines
          for(var v = 0; v < vLines; v++) {
            if(v> 0 && v % 10 == 0) {
              clr = $scope.majorLineColor;
            }
            else {
              clr = $scope.minorLineColor;
            }
            
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.strokeStyle = clr;
            ctx.stroke();
            x += spacing;
          }
          
          //draw the horizontal lines
          for(var h = 0; h < hLines; h++) {
            if(h > 0 && h % 10 == 0) {
              clr = $scope.majorLineColor;
            }
            else {
              clr = $scope.minorLineColor;
            }
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.strokeStyle = clr;
            ctx.stroke();
            y += spacing;
          }
        }
      }
    }
  }
});




yuvalsDirectives.directive("ybBubbles", function() {
  return {
    replace: false,
    restrict: "EA",
    template: '<canvas ng-init="init()" width="{{width}}" height="{{height}}" style="position: fixed"/>',

    scope: {
      width: "@width",
      height: "@height",
      count: "@count",
      dimmer: "=dimmer",
      animate: "=animate"
    },

    link: function($scope, element, attrs) {
      $scope.element = element;
      $scope.attrs = attrs;
      $scope.bubbles;
    },

    controller: function($scope, $timeout, helperService) {   
      $scope.helperService = helperService;

      $scope.init = function() {
        $timeout(function() {
          $scope.setCanvasDimensions();
          $scope.initializeBubbles();

          $scope.$watch('animate', function(newValue, oldValue) {
            if($scope.animate == true) {
              $scope.setCanvasDimensions();
              $scope.draw();
            }
          });
        });
        
        $(window).resize(function() {
          $scope.setCanvasDimensions();
        });       
      };
      
      $scope.setCanvasDimensions = function() {
        if($scope.canvas == null) {
          $scope.canvas = $scope.element.find('canvas')[0];
        }
        
        $scope.canvas.width = window.innerWidth;
        $scope.canvas.height = window.innerHeight;
        $scope.w = $scope.canvas.width;
        $scope.h = $scope.canvas.height; 
        $scope.center = {"x" : $scope.w/2, "y" : $scope.h/2}; 
      }

      $scope.initializeBubbles = function() {
        $scope.bubbles = [];

        for(var b = 0; b < $scope.count; b++) {
          $scope.bubbles.push(new $scope.createBubble(b));
        }
      }
         
      $scope.createBubble = function(i) {
        this.id = "bubble _" + i;

        this.create = function() {
          this.x = parseInt(Math.random() * $scope.w);
          this.y = parseInt(Math.random() * $scope.h);
          var maxer = Math.max($scope.w, $scope.h);
          this.radius = 1;
          this.alpha = .15;
          this.vr = Math.max(2, parseInt(Math.random() * 10));
          this.maxRadius = Math.max(maxer/4, parseInt(Math.random() * maxer/2));
          this.frames = parseInt(this.maxRadius / this.vr);
          this.color = "rgb(" + $scope.helperService.generateRandomColor() + ")"; 
          this.frames = this.maxRadius / this.vr;
          this.alphaDecay = (this.alpha / this.frames);
        }

        this.create();

        this.rebirth = function() {   
          this.create();
        }

        this.drawMe = function(ctx) {
          if(this.alpha <= 0 || this.radius >= this.maxRadius) {
            this.rebirth(ctx);
          }
          else {
            var alpha = this.alpha;

            if($scope.dimmer) {
              alpha = alpha/2;
            }

            ctx.globalAlpha = alpha; 
            ctx.fillStyle = this.color; //gradient; 
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            var gradient = ctx.createRadialGradient(this.x, this.y, this.radius/2, this.x, this.y, this.radius);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'white');
            ctx.fillStyle = gradient; 
            ctx.fill();

            this.radius += this.vr; 
            this.alpha -= this.alphaDecay;
          }    
        };
      }

      $scope.drawBubbles = function() {
        var ctx = $scope.ctx;
        var center = $scope.center;
        ctx.globalAlpha = 0.1;

        for(var p = 0; p < $scope.bubbles.length; p++) {
          var bubble = $scope.bubbles[p];
          bubble.drawMe(ctx);          
        }
      }

      $scope.draw = function() {
        if($scope.canvas != null && $scope.animate) {
          $scope.ctx = $scope.canvas.getContext("2d");                 
          $scope.ctx.clearRect(0, 0, $scope.w, $scope.h);          
          $scope.drawBubbles();
          $timeout($scope.draw, 50);
        }
      }
    }
  }
});


yuvalsDirectives.directive("ybHeartRate", function() {
  return {
    replace: false,
    restrict: "EA",
    template: '<canvas ng-init="init()" width="{{width}}" height="{{height}}"/>',

    scope: {
      width: "@width",
      height: "@height",
      /*majorLineColor: "@majorLineColor",
      minorLineColor: "@minorLineColor",
      spacing: "@spacing"*/
    },

    link: function($scope, element, attrs) {
      $scope.element = element;
      $scope.attrs = attrs;
      $scope.majorLineColor = "#999";
      $scope.minorLineColor = "#ddd";
      $scope.gridAlpha = .5;
      $scope.canvas =  $scope.element.find('canvas')[0];
      $scope.drawGridDelayed();
    },

    controller: function($scope, $timeout) {

      $scope.drawGridDelayed = function() {
        $timeout($scope.drawGrid);
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

          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = $scope.minorLineColor;
          ctx.rect(0, 0, w, h);
          ctx.stroke();

          ctx.lineWidth = 1;
          ctx.globalAlpha = $scope.gridAlpha;
          
          //draw the vertical lines
          for(var v = 0; v < vLines; v++) {
            if(v > 0) {
              if(v % 10 == 0) {
                clr = $scope.majorLineColor;
              }
              else {
                clr = $scope.minorLineColor;
              }
              
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, h);
              ctx.strokeStyle = clr;
              ctx.stroke();
            }

            x += spacing;
          }
          
          //draw the horizontal lines
          for(var h = 0; h < hLines; h++) {
            if(h > 0) {
              if(h % 10 == 0) {
                clr = $scope.majorLineColor;
              }
              else {
                clr = $scope.minorLineColor;
              }
              
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
