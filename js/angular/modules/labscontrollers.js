  var LabsModule = angular.module('LabsModule', []);
  LabsModule.controller('RippleCtrl', RippleCtrl); 

  function RippleCtrl($scope, $timeout) {
    $scope.width;
    $scope.height;
    $scope.half_width;
    $scope.half_height;
    $scope.size;
    $scope.delay;
    $scope.oldind;
    $scope.newind;
    $scope.riprad,
    $scope.ripplemap;
    $scope.last_map;
    $scope.ripple;
    $scope.texture;
    $scope.line_width;
    $scope.step; 
    $scope.count;
    $scope.intervalRun;
    $scope.intervalDisturb;   
    
    $scope.init = function() {
      $scope.canvas = document.getElementById("ripplecanvas");
      $scope.ctx = $scope.canvas.getContext("2d");
      $scope.backgroundImg = new Image();
      $scope.backgroundImg.src = "images/backgroundtexturetile.png";
      
      $scope.backgroundImg.onload = function() {
        $scope.drawBackground();
      };
      
      $scope.canvas.width = window.innerWidth;
      $scope.canvas.height = window.innerHeight;
      
      $scope.initRipple();
      $scope.drawBackground();
    };
    
    $scope.initRipple = function() {
      clearInterval($scope.intervalRun);
      clearInterval($scope.intervalDisturb);
      
      $scope.width = $scope.canvas.width;
      $scope.height = $scope.canvas.height;
      $scope.half_width =$scope. width >> 1;
      $scope.half_height = $scope.height >> 1;
      $scope.size = $scope.width * ($scope.height + 2) * 2;
      $scope.delay = 10;
      $scope.oldind = $scope.width;
      $scope.newind = $scope.width * ($scope.height + 3);
      $scope.riprad = 10;
      $scope.ripplemap = [];
      $scope.last_map = [];
      $scope.ripple;
      $scope.texture;
      
      $scope.intervalRun = setInterval($scope.run, $scope.delay);
      var rnd = Math.random;
    
      $scope.intervalDisturb = setInterval(function() {
        $scope.disturb(rnd() * $scope.width, rnd() * $scope.height);
      }, 100);
    };
    
    $scope.movement = function(evt) {
      $scope.disturb(evt.offsetX || evt.layerX, evt.offsetY || evt.layerY);
    };
    
    $scope.run = function() {
      if($scope.ripple == undefined) {
        return;  
      }
      
      $scope.newframe();
      $scope.ctx.putImageData($scope.ripple, 0, 0);
    };
    
    $scope.disturb = function(dx, dy) {
      dx <<= 0;
      dy <<= 0;
      
      for (var j = dy - $scope.riprad; j < dy + $scope.riprad; j++) {
        for (var k = dx - $scope.riprad; k < dx + $scope.riprad; k++) {
          $scope.ripplemap[$scope.oldind + (j *$scope. width) + k] += 128;
        }
      }
    };
    
    $scope.newframe = function() {
      var a, b, data, cur_pixel, new_pixel, old_data;
      var t = $scope.oldind; $scope.oldind = $scope.newind; $scope.newind = t;
      var i = 0;
      
      var _width = $scope.width,
        _height = $scope.height,
        _ripplemap = $scope.ripplemap,
        _last_map = $scope.last_map,
        _rd = $scope.ripple.data,
        _td = $scope.texture.data,
        _half_width = $scope.half_width,
        _half_height = $scope.half_height;
      
      for(var y = 0; y < _height; y++) {
        for(var x = 0; x < _width; x++) {
          var _newind = $scope.newind + i, _mapind =$scope. oldind + i;
          data = (
            _ripplemap[_mapind - _width] + 
            _ripplemap[_mapind + _width] + 
            _ripplemap[_mapind - 1] + 
            _ripplemap[_mapind + 1]) >> 1;
              
          data -= _ripplemap[_newind];
          data -= data >> 5;
          
          _ripplemap[_newind] = data;

          //where data=0 then still, where data>0 then wave
          data = 1024 - data;
          
          old_data = _last_map[i];
          _last_map[i] = data;
          
          if (old_data != data) {
            //offsets
            a = (((x - _half_width) * data / 1024) << 0) + _half_width;
            b = (((y - _half_height) * data / 1024) << 0) + _half_height;

            //bounds check
            if (a >= _width) a = _width - 1;
            if (a < 0) a = 0;
            if (b >= _height) b = _height - 1;
            if (b < 0) b = 0;

            new_pixel = (a + (b * _width)) * 4;
            cur_pixel = i * 4;
            
            _rd[cur_pixel] = _td[new_pixel];
            _rd[cur_pixel + 1] = _td[new_pixel + 1];
            _rd[cur_pixel + 2] = _td[new_pixel + 2];
          }
          
          ++i;
        }
      }
    };
    
    
    $scope.drawBackground = function() {
      var ctx = $scope.ctx;
      var w = $scope.canvas.width;
      var h = $scope.canvas.height;
      ctx.globalAlpha = 1; 
      
      if($scope.backgroundImg != null) {
        var ptrn = ctx.createPattern($scope.backgroundImg, 'repeat');
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 0, w, h);
        
        //apply ripples

        $scope.texture = ctx.getImageData(0, 0, w, h);
        $scope.ripple = ctx.getImageData(0, 0, w, h);
        
        for (var i = 0; i < $scope.size; i++) {
          $scope.last_map[i] = $scope.ripplemap[i] = 0;
        }
      }
    };
  }
  
  
  
      