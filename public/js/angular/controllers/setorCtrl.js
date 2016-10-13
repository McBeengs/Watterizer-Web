// CONTROLLER DE SETORES
app.controller('setorCtrl', function($scope, $http) {
	// LISTA TODOS OS SETORES
	$http.get("/setor/arduino")
	.then(function (response) {
		$scope.setores = response.data;
		console.log($scope.setores);
	}, function(response){
		console.log("Falhou")
	});
});