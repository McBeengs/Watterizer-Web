// CONTROLLER DE SETORES
app.controller('setoresCtrl', function($scope, $http) {
	$scope.listAll = function(){
		$http.get("http://localhost:1515/setor")
		.then(function (response) {
			$scope.setores = response.data;
		}, function(response){
			$scope.setores = "Nenhum setor foi encontrado";
		});
	}
	$http.get("http://localhost:1515/setor")
	.then(function (response) {
		$scope.setores = response.data;
	}, function(response){
		console.log("Falhou")
	});
});