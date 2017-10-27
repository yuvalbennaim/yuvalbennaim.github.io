
var app = angular.module('AppModule', []);

app.service('dataService', function($http, $timeout) {
	var dataService = {};
	dataService.loading = true;
	dataService.showWizard = false;
	dataService.showWizardInner = false;
	dataService.minimizedWizard = false;
	dataService.wizardStep = 1;
	dataService.name = "Remediator Prototype";

	dataService.files = [
		{"name": "evil1.exe", "path": "c:/windows/", "selected": false, "status": 0},
		{"name": "evil1.exe", "path": "c:/users/yuval/", "selected": false, "status": 0},
		{"name": "evil2.exe", "path": "c:/windows/", "selected": false, "status": 0},
		{"name": "evil3.exe", "path": "c:/windows/", "selected": false, "status": 0},
		{"name": "evil4.exe", "path": "c:/windows/", "selected": false, "status": 0}
	];
	return dataService;
});

app.controller('MainController', ['$scope', '$timeout','dataService', function($scope, $timeout, dataService) {
	$scope.ds = dataService;

	$scope.init = function() {
		$timeout(function() {
			$scope.ds.loading = false;
		}, 2000); 
	}

	$scope.showWizardFunc = function() {
		dataService.showWizard = true;
		dataService.minimizedWizard = false;

		$timeout(function() {
			dataService.showWizardInner = true;
		}, 1000); 
	}

	$scope.determineWizardClass = function() {
		var cls = "wizard";

		if($scope.ds.minimizedWizard) {
			cls = "wizard-minimized";
		}
		else if(!$scope.ds.showWizard) {
			cls = "wizard-hidden";
		}

		return cls;
	}

	$scope.hideWizardFunc = function() {
		dataService.wizardStep = 1;
		dataService.showWizard = false;
		dataService.showWizardInner = false;
	}

	$scope.minimizeWizard = function() {
		dataService.minimizedWizard = true;
		dataService.wizardStep = 1;
		dataService.showWizard = false;
		dataService.showWizardInner = false;
	}

	$scope.nextStep = function() {
		dataService.wizardStep++;
	}
}]);