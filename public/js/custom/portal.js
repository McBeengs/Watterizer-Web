
function startTable() {
	$.ajax({
		url: "/sessao",
		success: function(response) {
			setTimeout(function() {
				var table=$('#content-portal table').DataTable({
					"language": {
						"url": "https://cdn.datatables.net/plug-ins/1.10.12/i18n/Portuguese-Brasil.json"
					},
					"dom": '<"top"<"col-xs-6"i>f>tr<"bottom"<"col-xs-6"l><"col-xs-6"p>>',
					"order": [[ 0, "desc" ]]        
				});
				$.ajax({
					url: "/dados/advertencia",
					headers: {
						"token":response[1]
					},
					success: function(response) {
						for (var i = 0; i <= response.length - 1; i++) {
							table.row.add( [
								response[i].data,
								response[i].id_setor,
								response[i].titulo,
								response[i].id_usuario,
								response[i].mensagem
								]).draw( false );
						};
					},
					error: function(xhr) {
							
					}
				});

			},200);
		},
		error: function(xhr) {
		
		}	
	});	
}

$.ajax({
	url: "/sessao",
	success: function(response) {
		console.log(response);
		$( "#name").html(response[0]);
	},
	error: function(xhr) {
		
	}	
});