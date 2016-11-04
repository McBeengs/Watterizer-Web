// CONTROLLER DA HOME
app.controller('homeCtrl', function($scope, $http) {
	// LISTA TODOS OS SETORES
	var intervalo=setInterval(function () {
		if ($scope.load) {
		$http.get("/dados/contador")
		.then(function (response) {
			$scope.dados = response.data[0];
			console.log($scope.dados);
		}, function(response){
			console.log("Falhou")
		});
		clearInterval(intervalo);
	}
	}, 50);
});