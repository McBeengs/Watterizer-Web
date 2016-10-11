// CONTROLLER DE SETORES
app.controller('setorCtrl', function($scope, $http) {
	// LISTA TODOS OS SETORES
	$http.get("/setor")
	.then(function (response) {
		$scope.setores = response.data;
		$scope.setores.arduinos = new Array();
	}, function(response){
		console.log("Falhou")
	});

	$http.get("/dados/arduino")
	.then(function (response) {
		for (var i = response.length - 1; i >= 0; i--) {
			for (var i = $scope.setores.length - 1; i >= 0; i--) {
				if(response[i].id_setor = $scope.setores[i].id){
					$scope.setores.arduinos.push(response[i]);
					break;
				}
			}
		}
	});
	console.log($scope.setores)
});