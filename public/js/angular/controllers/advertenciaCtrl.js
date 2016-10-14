// CONTROLLER DE SETORES
app.controller('setoresCtrl', function($scope, $http) {
	// LISTA TODOS OS SETORES
	$http.get("/dados/advertencia")
	.then(function (response) {
		$scope.setores = response.data;
	}, function(response){
		console.log("Falhou")
	});
});