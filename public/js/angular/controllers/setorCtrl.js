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

		$scope.getPcs = function () {
			$http.get("/dados/computadores")
			.then(function (response) {
				$scope.computadores = [];
				for (var i = 0; i <= response.data.length - 1; i++) {
					if (response.data[i].posicionado==0) {
						$scope.computadores.push(response.data[i]);
					}
				}
				console.log($scope.computadores)
			}, function(response){
				console.log("Falhou")
			});
		}
		$scope.getPcs();

		$scope.removePc = function (pcSel) {
			console.log($scope.pcSel);
			$http.put("/dados/computadores", {
				id:pcSel,
				posicionado:0
			});
			$scope.getPcs();
		}

		$scope.addPc = function () {
			$http.put("/dados/computadores", {
				id:$scope.pcSel,
				posicionado:1
			});
			$scope.getPcs();
		}

		$scope.saveCanvas = function (setor, code) {
			$http.post("/canvas/", {
				codificacao:code,
				setor:setor
			})
		}
	}, 50);
});