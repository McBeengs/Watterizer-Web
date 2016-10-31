// CONTROLLER DE USUARIOS
app.requires.push('datatables');
app.controller("usuarioCtrl", function($scope,$window,$http, DTOptionsBuilder, DTColumnBuilder) {
	var language = {
		"sEmptyTable": "Nenhum registro encontrado",
    "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
    "sInfoFiltered": "(Filtrados de _MAX_ registros)",
    "sInfoPostFix": "",
    "sInfoThousands": ".",
    "sLengthMenu": "_MENU_ resultados por página",
    "sLoadingRecords": "Carregando...",
    "sProcessing": "Processando...",
    "sZeroRecords": "Nenhum registro encontrado",
    "sSearch": "Pesquisar",
    "oPaginate": {
        "sNext": "Próximo",
        "sPrevious": "Anterior",
        "sFirst": "Primeiro",
        "sLast": "Último"
    },
    "oAria": {
        "sSortAscending": ": Ordenar colunas de forma ascendente",
        "sSortDescending": ": Ordenar colunas de forma descendente"
    }
	}
	$scope.dtOptions = DTOptionsBuilder.newOptions()
	.withLanguage(language)
	// .withDOM('<"top"<"col-xs-6"i>f>tr<"bottom"<"col-xs-6"l><"col-xs-6"p>>');
	// .withPaginationType('full_numbers')
	// .withDisplayLength(2)
	// .withOption('order', [1, 'desc'])


	// LISTA TODOS OS USUARIOS
	var intervalo=setInterval(function () {
		if ($scope.load) {
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
		clearInterval(intervalo);
		};
	},10);


	

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
		$scope.titulo="Editar Usuário"
		
	}
	$scope.novo = function() {
		$scope.usuario = {};
		$scope.titulo="Novo Usuário";
	}
	$scope.desliga = function() {
		var pcsligados;
		var pcligado={};
		$http.get("/pcligado")
		.then(function (response) {
			pcsligados=response.data;
			for (var i = pcsligados.length - 1; i >= 0; i--) {
				if (pcsligados[i]=="70-54-D2-C6-A7-7E") {
					pcligado.mac="70-54-D2-C6-A7-7E"
					$http.post("/desligapc", pcligado)
					.then(function (response) {
					}, function(response){
						console.log("Falhou")
					});
				}
			};
		}, function(response){
			console.log("Falhou")
		});
		
	}
	$scope.excluir = function(id) {
		$scope.usuarioExclusao={};
		$http.delete("/dados/usuario/"+id, $scope.usuario)
		.then(function (response) {
		}, function(response){
			console.log("Falhou")
		});
	}
	$scope.preparaExclusao = function(nome,id) {
		$scope.usuarioExclusao={}
		$scope.usuarioExclusao.nome=nome;
		$scope.usuarioExclusao.id=id;
	}
	$scope.autoExclusao = function(id) {
		if (id!=$scope.usuarioLogado.data[2]) {
			return true;
		}
		else{
			return false;
		}
	}
	$scope.create = function() {
		if ($scope.usuario.id==undefined) {
			console.log("create");
			$http.post("/dados/usuario", $scope.usuario)
			.then(function (response) {
				$window.location.reload();
			}, function(response){
				console.log("Falhou")
			});
		}
		else{
			$http.put("/dados/usuario", $scope.usuario)
			.then(function (response) {
				$window.location.reload();
			}, function(response){
				console.log("Falhou")
			});
		}
		
	}
});