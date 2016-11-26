// CONTROLLER DE SETORES
app.controller('setorCtrl', function($scope, $http,$timeout,$window) {
	// LISTA TODOS OS SETORES
	setTimeout(function() {
		$scope.getCanvas=function () {
			$http.get("/setor/arduino")
			.then(function (response) {
				$scope.setores = response.data;
			}, function(response){
				console.log("Falhou")
			});
		}
		$scope.getCanvas();
		$scope.getPcs = function () {
			$http.get("/dados/computadores")
			.then(function (response) {
				$scope.equipamentos=response.data
				$http.get("/pcligado")
				.then(function (response) {
					$scope.pcsligados=response.data;
					$scope.pcsligados.push("70-54-D2-C6-A7-7E")
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
				console.log($scope.computadores)
			}, function(response){
				console.log("Falhou")
			});
		}
		$scope.getPcs();

		$scope.removePc = function (pcSel) {
			console.log(pcSel);
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
				codigo:code,
				setor:setor
			})
		}
	}, 500);

var pcligado={};
$scope.desliga = function (mac) {
	for (var i = $scope.pcsLigadosFull.length - 1; i >= 0; i--) {
		if ($scope.pcsLigadosFull[i].mac==mac) {
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