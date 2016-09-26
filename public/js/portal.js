
$(document).ready(function() {
	setTimeout(function() {
		$('#content-portal table').DataTable({
			"language": {
				"url": "https://cdn.datatables.net/plug-ins/1.10.12/i18n/Portuguese-Brasil.json"
			},
			"dom": '<"top"<"col-xs-6"i>f>tr<"bottom"<"col-xs-6"l><"col-xs-6"p>>',
			"order": [[ 0, "desc" ]]        
		});
	},200);
	$.ajax({
		url: "/dados/advertencia",
		success: function(response) {
			for (var i = 0; i <= response.length - 1; i++) {
				$( "#content-portal table tbody").append( "<tr><td>"+response[i].data+"</td><td>Setor "+response[i].id_setor+"</td><td>"+response[i].titulo+"</td><td>"+response[i].id_usuario+"</td><td>"+response[i].mensagem+"</td></tr>" );
			};
		},
		error: function(xhr) {
		//Do Something to handle error
	}
});
	
});

$.ajax({
	url: "/dados/sessao",
	success: function(response) {
		$( "#name").html(response);
	},
	error: function(xhr) {
		//Do Something to handle error
	}	
});