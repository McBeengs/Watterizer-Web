// CONTROLLER DE USUARIOS
app.requires.push('datatables');
app.controller("usuarioCtrl", function($scope, $http) {
	// LISTA TODOS OS USUARIOS
	$scope.showDT = true;
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
	}, function(response){
		console.log("Falhou")
	});
	$http.get("/dados/perfil")
	.then(function (response) {
		$scope.perfis = response.data;
	}, function(response){
		console.log("Falhou")
	});

}, 0);
	
	$scope.create = function() {
		$http.post("/dados/usuario", $scope.usuario)
		.then(function (response) {
			console.log($scope.usuario);
		}, function(response){
			console.log("Falhou")
		});
	}
});