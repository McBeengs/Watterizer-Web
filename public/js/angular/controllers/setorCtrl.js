// CONTROLLER DE SETORES
app.controller('setorCtrl', function($scope, $http) {
	// LISTA TODOS OS SETORES
	setTimeout(function() {
		$http.get("/setor/arduino")
		.then(function (response) {
			$scope.setores = response.data;
		}, function(response){
			console.log("Falhou")
		});
	}, 50);
});