// CONTROLLER DE USUARIOS
app.controller("usuarioCtrl", function($scope, $http) {
	// LISTA TODOS OS USUARIOS
	setTimeout(function() {
		$http.get("/dados/usuario")
	.then(function (response) {
		console.log(response.data)
		$scope.usuarios = response.data;
	}, function(response){
		console.log("Falhou")
	});
	$http.get("/setor/arduino")
	.then(function (response) {
		$scope.setores = response.data;
		console.log($scope.setores);
	}, function(response){
		console.log("Falhou")
	});
}, 10);
	
	$scope.create = function() {
		$http.post("/dados/usuario", $scope.usuario)
		.then(function (response) {
			console.log($scope.usuario);
		}, function(response){
			console.log("Falhou")
		});
	}
});