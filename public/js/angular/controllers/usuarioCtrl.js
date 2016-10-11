// CONTROLLER DE USUARIOS
app.controller("usuarioCtrl", function($scope, $http) {
	// LISTA TODOS OS USUARIOS
	// $http.get("/dados/usuario")
	// .then(function (response) {
	// 	$scope.usuarios = response.data;
	// }, function(response){
	// 	console.log("Falhou")
	// });
	// LISTA TODOS OS SETORES
	$http.get("/setor")
	.then(function (response) {
		$scope.setores = response.data;
		console.log($scope.setores);
	}, function(response){
		console.log("Falhou");
	});
});