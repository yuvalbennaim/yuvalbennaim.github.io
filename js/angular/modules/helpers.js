var helperModule = angular.module('helperModule', []);

helperModule.service('helperService', function() {
  var helperService = {};
  
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