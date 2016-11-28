// CONTROLLER DE SETORES
app.controller('setorCtrl', function($scope, $http,$timeout,$window) {
	// LISTA TODOS OS SETORES
	$scope.getCanvas=function () {
		$http.get("/setor/arduino")
		.then(function (response) {
			$scope.setores = response.data;
		}, function(response){
			console.log("Falhou")
		});
	}
	$scope.getPcs = function () {
		$http.get("/dados/computadores")
		.then(function (response) {
			$scope.equipamentos=response.data
			$http.get("/pcligado")
			.then(function (response) {
				$scope.pcsligados=response.data;
				console.log($scope.pcsligados);
			}, function(response){
				console.log("Falhou")
			});
			$scope.computadores = [];
			for (var i = 0; i <= response.data.length - 1; i++) {
				if (response.data[i].posicionado==0) {
					$scope.computadores.push(response.data[i]);
				}
			}
		}, function(response){
			console.log("Falhou")
		});
	}
	$scope.getPcsChange = function (id) {
		if (id!=0) {
			$http.get("/dados/computadores")
		.then(function (response) {
			$scope.equipamentos=response.data
			$http.get("/pcligado")
			.then(function (response) {
				$scope.pcsligados=response.data;
				console.log($scope.pcsligados);
			}, function(response){
				console.log("Falhou")
			});
			$scope.computadores = [];
			for (var i = 0; i <= response.data.length - 1; i++) {
				if (response.data[i].posicionado==0 && response.data[i].id_setor==id) {
					$scope.computadores.push(response.data[i]);
				}
			}
		}, function(response){
			console.log("Falhou")
		});
	}
		
	}
	var intervalo=setInterval(function () {
		if ($scope.load) {
			
			$scope.getCanvas();
			
			$scope.getPcs();

			
			clearInterval(intervalo);
		}
	}, 0);
	$scope.removePc = function (pcSel) {
		$http.put("/dados/computadores", {
			id:pcSel,
			posicionado:0
		});
		$scope.getPcs();
	}

	$scope.addPc = function () {
		console.log($scope.pcSel)
		$http.put("/dados/computadores", {
			id:$scope.pcSel,
			posicionado:1
		});
		$scope.getPcs();
	}

	$scope.saveCanvas = function (setor, code) {
		$http.post("/canvas/", {
			codigo:code,
			setor:setor
		})
	}
	var pcligado={};
	$scope.desliga = function (mac) {
		console.log(mac,$scope.pcsligados[i])
		for (var i = $scope.pcsligados.length - 1; i >= 0; i--) {
			if ($scope.pcsligados[i]==mac) {
				pcligado.mac=mac
				$http.post("/desligapc", pcligado)
				.then(function (response) {
				}, function(response){
					console.log("Falhou")
				});
			}
		};
	}

	$scope.novo = function() {
		$scope.setor = {};
		$scope.titulo="Novo Setor";
	}
	$scope.create = function() {
		if ($scope.setor.id==undefined) {
			console.log("create");
			$http.post("/dados/setor", $scope.setor)
			.then(function (response) {
				$window.location.reload();
			}, function(response){
				console.log("Falhou")
			});
		}
		else{
			console.log("update")
			$http.put("/dados/setor", $scope.setor)
			.then(function (response) {
				$window.location.reload();
			}, function(response){
				console.log("Falhou")
			});
		}
	}
	$scope.editar = function(setor) {
		var date;
		$scope.setor = {};
		$scope.setor.id=setor.id;
		$scope.setor.setor=setor.setor;
		$scope.titulo="Editar Setor"

	}
	$scope.excluir = function(id) {
		$scope.setorExclusao={};
		$http.delete("/dados/setor/"+id, $scope.setor)
		.then(function (response) {
			$window.location.reload();
		}, function(response){
			console.log("Falhou")
		});
	}

	$scope.preparaExclusao = function(setor,id) {
		$scope.setorExclusao={}
		$scope.setorExclusao.setor=setor;
		$scope.setorExclusao.id=id;
	}

});