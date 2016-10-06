// APP BASE
var app = angular.module('wattzApp', []);

// CONTROLLER DE SETORES
angular.module("wattzApp").controller('setoresCtrl', function($scope, $http) {

	$scope.algo = function(){
		$http.get("http://localhost:1515/setor").then(function (response) {
			$scope.setores = response.data;
			console.log(response);
		}, function(response){
			console.log(response);
		});
	}
window.onload = $scope.algo();
});


// CONTROLLER DE USUARIOS