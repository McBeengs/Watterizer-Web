// CONTROLLER DA HOME
app.controller('homeCtrl', function($scope, $http) {
	// LISTA TODOS OS SETORES
	setTimeout(function() {
		$http.get("/dados/contador")
		.then(function (response) {
			$scope.dados = response.data[0];
			console.log($scope.dados);
		}, function(response){
			console.log("Falhou")
		});
	}, 50);
});