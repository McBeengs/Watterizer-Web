// CONTROLLER DE SETORES
angular.module("wattzApp").controller('setoresCtrl', function($scope, $http) {
	$scope.algo = function(){
		$http.get("/setor")
		.then(function (response) {
			$scope.setores = response.data;
		}, function(response){
			$scope.setores = "Nenhum setor foi encontrado";
		});
	}
});