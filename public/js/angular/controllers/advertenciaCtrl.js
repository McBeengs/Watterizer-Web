// CONTROLLER DE ADVERTENCIAS
		console.log(config);
app.controller('advertenciaCtrl', function($scope, $http) {
	// LISTA TODAS AS ADVERTENCIAS
	$http.get("/dados/advertencia", config)
	.then(function (response) {
		$scope.advertencias = response.data;
		console.log(response);
	}, function(response){
		console.log("Falhou");
	});
});