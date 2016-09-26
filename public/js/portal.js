$(document).ready(function() {
	$('#content-portal table').DataTable({
		"language": {
			"url": "https://cdn.datatables.net/plug-ins/1.10.12/i18n/Portuguese-Brasil.json"
		},
		"dom": '<"top"<"col-xs-6"i>f>tr<"bottom"<"col-xs-6"l><"col-xs-6"p>>',
		"order": [[ 0, "desc" ]]        
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