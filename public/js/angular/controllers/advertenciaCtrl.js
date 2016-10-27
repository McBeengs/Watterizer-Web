// CONTROLLER DE ADVERTENCIAS
app.requires.push('datatables');
app.controller('advertenciaCtrl', function($scope, $http) {
	// LISTA TODAS AS ADVERTENCIAS
	$scope.showDT = true;
	setTimeout(function() {
		$http.get("/dados/advertencia")
		.then(function (response) {
			// console.log(.token);
			$scope.advertencias = response.data;
		}, function(response){
			console.log("Falhou");
		})
	}, 50);
});