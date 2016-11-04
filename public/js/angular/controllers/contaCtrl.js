//CONTROLLER DE CONFIGURAÇÂO DE CONTA
app.controller('contaCtrl', function($scope, $http,$window) {
	// LISTA TODOS OS USUARIOS
	var intervalo=setInterval(function () {
		if ($scope.load) {
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
			$http.get("/dados/pergunta")
			.then(function (response) {
				$scope.perguntas = response.data;
			}, function(response){
				console.log("Falhou")
			});
			$http.get("/dados/logado/")
			.then(function (response) {
				$scope.usuario = response.data[0];
				date=$scope.usuario.hora_entrada.split(':')
				date = new Date(1970, 0, 1, date[0], date[1], date[2]);
				$scope.usuario.hora_entrada=date;
				date=$scope.usuario.hora_intervalo.split(':')
				date = new Date(1970, 0, 1, date[0], date[1], date[2]);
				$scope.usuario.hora_intervalo=date;
				date=$scope.usuario.hora_saida.split(':')
				date = new Date(1970, 0, 1, date[0], date[1], date[2]);
				$scope.usuario.hora_saida=date;

			}, function(response){
				console.log("Falhou")
			});
			clearInterval(intervalo);
		};
	},5);

$scope.update = function() {
	$http.put("/dados/usuarioConta", $scope.usuario)
	.then(function (response) {
		$window.location.reload();
	}, function(response){
		console.log("Falhou")
	});	}
})
