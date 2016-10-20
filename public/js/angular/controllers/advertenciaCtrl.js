// CONTROLLER DE ADVERTENCIAS
app.controller('advertenciaCtrl', function($scope, $http) {
	// LISTA TODAS AS ADVERTENCIAS
	setTimeout(function (arguments) {
		$http.get("/dados/advertencia")
		.then(function (response) {
			// console.log(.token);
			$scope.advertencias = response.data;
			console.log(response);
		}, function(response){
			console.log("Falhou");
		})
	}, 0);
});