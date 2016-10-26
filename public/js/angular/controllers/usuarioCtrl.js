// CONTROLLER DE USUARIOS
app.requires.push('datatables');
app.controller("usuarioCtrl", function($scope, $http) {
	// LISTA TODOS OS USUARIOS
	$scope.showDT = true;
	setTimeout(function() {
		$http.get("/dados/usuario")
	.then(function (response) {
		console.log(response.data)
		$scope.usuarios = response.data;
	}, function(response){
		console.log("Falhou")
	});
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

}, 0);
	

	$scope.editar = function(usuario) {
		var date;
		$scope.usuario = {};
		$scope.usuario.id=usuario.id;
		$scope.usuario.nome=usuario.nome;
		$scope.usuario.username=usuario.username;
		$scope.usuario.email=usuario.email;
		$scope.usuario.telefone=usuario.telefone;
		date = new Date("Fri, 26 Sep 2014 "+usuario.hora_entrada+" GMT");
		$scope.usuario.hora_entrada=date;
		date = new Date("Fri, 26 Sep 2014 "+usuario.hora_intervalo+" GMT");
		$scope.usuario.hora_intervalo=date;
		date = new Date("Fri, 26 Sep 2014 "+usuario.hora_saida+" GMT");
		$scope.usuario.hora_saida=date;
		$scope.usuario.id_setor=usuario.id_setor;
		$scope.usuario.id_perfil=usuario.id_perfil;

		
	}
	$scope.create = function() {
		if ($scope.usuario.id==undefined) {
			console.log("create");
			$http.post("/dados/usuario", $scope.usuario)
		.then(function (response) {
			console.log($scope.usuario);
		}, function(response){
			console.log("Falhou")
		});
		}
		else{
			console.log("edit");
			$http.put("/dados/usuario", $scope.usuario)
		.then(function (response) {
		}, function(response){
			console.log("Falhou")
		});
		}
		
	}
});