// CONTROLLER DE USUARIOS
app.controller("usuarioCtrl", function($scope, $http) {
	// LISTA TODOS OS USUARIOS
	$http.get("/dados/usuario")
	.then(function (response) {
		$scope.usuarios = response.data;
	}, function(response){
		console.log("Falhou")
	});

	$scope.create = function() {
		$http.post("/dados/usuario", $scope.usuario)
		.then(function (response) {
			console.log($scope.usuario);
		}, function(response){
			console.log("Falhou")
		});
	}
});