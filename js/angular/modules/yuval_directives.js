
yuvalsDirectives = angular.module('yuvalsDirectives', []);


yuvalsDirectives.service('helperService', function() {
    var helperService = {};
    
    helperService.generateRandomColor = function() {
      var r = parseInt(Math.random() * 255);
      var g = parseInt(Math.random() * 255);
      var b = parseInt(Math.random() * 255);
      return r + "," + g + "," + b;
    }

    helperService.degreesToRadians = function(degrees) {
      return (Math.PI / 180) * degrees;
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
      height: "@height",
      majorLineColor: "@major",
      minorLineColor: "@minor",
      gridAlpha: "=alpha",
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
      animate: "=animate",
      alpha: "=alpha"
    },

    link: function($scope, element, attrs) {
      $scope.element = element;
      $scope.attrs = attrs;
      $scope.bubbles;

      $scope.$watch('alpha', function(newValue, oldValue) {
        $scope.setCanvasDimensions();
      });
    },

    controller: function($scope, $timeout, helperService) {

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
          this.alpha = $scope.alpha;
          this.vr = Math.max(2, parseInt(Math.random() * 10));
          this.maxRadius = Math.max(maxer/4, parseInt(Math.random() * maxer/2));
          this.frames = parseInt(this.maxRadius / this.vr);
          this.color = "rgb(" + helperService.generateRandomColor() + ")"; 
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



yuvalsDirectives.directive("ybPeacock", function() {
  return {
    replace: false,
    restrict: "EA",
    template: '<canvas ng-init="init()"/>',

    scope: {
      width: "@width",
      height: "@height",
      slices: "@slices"
    },

    link: function($scope, element, attrs) {
      $scope.element = element;
      $scope.attrs = attrs;
      $scope.canvas = $scope.element.find('canvas')[0];
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
          $scope.draw();
        });
      }

      $scope.setDimensions = function() {
        $scope.w = $scope.element.width();
        $scope.h = $scope.element.height();
        $scope.canvas.width = $scope.w;
        $scope.canvas.height = $scope.h;
        $scope.draw();
      }

      $scope.initSlices = function() {
        $scope.slicesArr = [];

        if($scope.slices == undefined) {
          $scope.slices = 6;
        }

        for(var i = 0; i < $scope.slices; i++) {
          $scope.slicesArr.push({"id" : "slice _" + i});
        }
      }

      $scope.drawSlice = function(ctx, size, thickness){
        thickness = thickness || 4;        
        //ctx.beginPath();

        ctx.fillStyle = "rgb(" + helperService.generateRandomColor() + ")"; 
        ctx.fillRect(0, 0, size, thickness);

        // ctx.lineTo(thickness *-1, -10);
        // ctx.lineTo(0, size * -1);
        // ctx.lineTo(thickness,-10);
        // ctx.lineTo(0,0);
        // ctx.fill();
        // ctx.stroke();
        // ctx.closePath();
      }

      $scope.draw = function() {
        if($scope.canvas != undefined) {
          var ctx = $scope.ctx = $scope.canvas.getContext("2d");
          var w = $scope.w;
          var h = $scope.h;
          var r = w/2;
          $scope.center = {"x" : w/2, "y" : h/2};

          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = $scope.graphMinorLineColor;

          ctx.strokeStyle = "#dd9999"; 
          ctx.lineWidth = 3; 
          ctx.beginPath();

          ctx.rect(0, 0, w, h);
          ctx.stroke(); 

          var angle = 0;
          var inc = 360 / $scope.slicesArr.length;

          ctx.translate( $scope.center.x,  $scope.center.y);

          for(var i = 0; i < $scope.slicesArr.length; i++) {
            var slice = $scope.slicesArr[i];
            ctx.save();
            var radians = helperService.degreesToRadians(angle);
            ctx.rotate(radians);
            $scope.drawSlice(ctx, r, 20);
            angle += inc;
            ctx.restore();
          }
        }
      }
    }
  }
});

