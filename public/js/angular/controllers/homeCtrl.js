// CONTROLLER DA HOME
app.controller('homeCtrl', function($scope, $http,$timeout) {
	// LISTA TODOS OS SETORES
	var intervalo=setInterval(function () {
		if ($scope.load) {
			$http.get("/pcligado")
			.then(function (response) {
				$scope.pcsLigadosCount = response.data.length;
			}, function(response){
				console.log("Falhou")
			});
			$http.get("/dados/contador")
			.then(function (response) {
				$scope.dados = response.data[0];
			}, function(response){
				console.log("Falhou")
			});
			clearInterval(intervalo);
		}
	}, 50);
	setTimeout(function () {
		var socket = io.connect($scope.ip+':1515');
		socket.on("pcLigado",function(data) {
			$timeout(function() {
				$scope.pcsLigadosCount = data.length;
			}, 1000);
		})
	}, 200);
	
	
});