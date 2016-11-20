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
	},0);


	

	$scope.editar = function(usuario) {
		var date;
		$scope.usuario = {};
		$scope.usuario.id=usuario.id;
		$scope.usuario.nome=usuario.nome;
		$scope.usuario.username=usuario.username;
		$scope.usuario.email=usuario.email;
		$scope.usuario.telefone=usuario.telefone;
		date=usuario.hora_entrada.split(':')
		date = new Date(1970, 0, 1, date[0], date[1], date[2]);
		$scope.usuario.hora_entrada=date;
		date=usuario.hora_intervalo.split(':')
		date = new Date(1970, 0, 1, date[0], date[1], date[2]);
		$scope.usuario.hora_intervalo=date;
		date=usuario.hora_saida.split(':')
		date = new Date(1970, 0, 1, date[0], date[1], date[2]);
		$scope.usuario.hora_saida=date;
		$scope.usuario.id_setor=usuario.id_setor;
		$scope.usuario.id_perfil=usuario.id_perfil;
		$scope.titulo="Editar Usuário"
		
	}

	$scope.novo = function() {
		console.log($scope.usuario);
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
			$window.location.reload();
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
		$http.post("/emailCheck", $scope.usuario)
		.then(function (response) {
			if (response.data == false) {
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
					console.log("update")
					$http.put("/dados/usuario", $scope.usuario)
					.then(function (response) {
						$window.location.reload();
					}, function(response){
						console.log("Falhou")
					});
				}
			}
			else{
				alert("Email já existe")
			}
			
		}, function(response){
			console.log("Falhou")
		});
		
	}

	// $scope.telMask = function (){
	// 	console.log("Mudou", $("#txt-telefone").val().length);
	// 	if($("#txt-telefone").val().length == 15){
	// 		$("#txt-telefone").mask("(00) 00000-0000");
	// 	} else {
	// 		$("#txt-telefone").mask("(00) 0000-0000");
	// 	}
	// }

	$(function() {
		$( "#txt-nome" ).autocomplete({
			source: function( request, response ) {		
				$.ajax({
					type: 'POST',
					url: "/gerausuario",
					data: {
						nome: request.term
					},
					success: function( data ) {
						$scope.usuario.username = data
						$("#txt-username").val(data);
					}
				});
			},
			minLength: 3
		});
	});
});