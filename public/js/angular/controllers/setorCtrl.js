// CONTROLLER DE SETORES
app.controller('setorCtrl', function($scope, $http) {
	// LISTA TODOS OS SETORES
	setTimeout(function() {
		$http.get("/setor/arduino")
		.then(function (response) {
			$scope.setores = response.data;
			$scope.canvasSel = response.data[0];
			console.log($scope.setores)
		}, function(response){
			console.log("Falhou")
		});

		$scope.addPc = function () {
			$http.put("/dados/computadores", {
				id:id,
				posicionado:1
			});
			$scope.getPcs();
		}

		$scope.getPcs = function (id) {
			$http.get("/dados/computadores")
			.then(function (response) {
				$scope.computadores = [];
				for (var i = 0; i <= response.data.length - 1; i++) {
					if (response.data[0].posicionado==0) {
						$scope.computadores.push(response.data[i]);
					}
				}
				console.log($scope.computadores)
			}, function(response){
				console.log("Falhou")
			});
		}
	}, 50);
});