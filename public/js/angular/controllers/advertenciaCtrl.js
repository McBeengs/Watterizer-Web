// CONTROLLER DE ADVERTENCIAS
app.requires.push('datatables');
app.controller('advertenciaCtrl', function($scope, $http,DTOptionsBuilder, DTColumnBuilder) {
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
	// LISTA TODAS AS ADVERTENCIAS
	$scope.showDT = true;
	setTimeout(function() {
		$http.get("/dados/advertencia")
		.then(function (response) {
			// console.log(.token);
			$scope.advertencias = response.data;
		}, function(response){
			console.log("Falhou");
		})
	}, 50);
});