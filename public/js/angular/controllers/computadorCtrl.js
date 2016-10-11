// CONTROLLER DE SETORES
app.controller('pcCtrl', function($scope, $http) {
	// LISTA TODOS OS SETORES
	$http.get("")
	.then(function (response) {
		$scope.setores = response.data;
	}, function(response){
		console.log("Falhou")
	});
});