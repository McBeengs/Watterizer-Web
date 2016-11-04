// CONTROLLER DA HOME
app.controller('homeCtrl', function($scope, $http,$timeout) {
	var socket = io.connect('localhost:1515');
	// LISTA TODOS OS SETORES
	var intervalo=setInterval(function () {
		if ($scope.load) {
			$http.get("/pcligado")
			.then(function (response) {
				$scope.pcsLigadosCount = response.data.length;
				console.log($scope.dados);
			}, function(response){
				console.log("Falhou")
			});
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
	socket.on("pcLigado",function(data) {
		$timeout(function() {
			$scope.pcsLigadosCount = data.length;
		}, 1000);
	})
	
});