// CONTROLLER DE SETORES
app.controller('setoresCtrl', function($scope, $http) {
	// LISTA TODOS OS SETORES
	$http.get("http://localhost:1515/setor")
	.then(function (response) {
		$scope.setores = response.data;
	}, function(response){
		console.log("Falhou")
	});
});