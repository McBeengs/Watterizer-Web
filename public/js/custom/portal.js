
// function startTable() {
// 	$('#content-portal table').DataTable({
// 		"language": {
// 			"url": "https://cdn.datatables.net/plug-ins/1.10.12/i18n/Portuguese-Brasil.json"
// 		},
// 		"dom": '<"top"<"col-xs-6"i>f>tr<"bottom"<"col-xs-6"l><"col-xs-6"p>>',
// 		"order": [[ 0, "desc" ]]        
// 	});
// }

// $.ajax({
// 	url: "/sessao",
// 	success: function(response) {
// 		console.log(response);
// 		$( "#name").html(response[0]);
// 	},
// 	error: function(xhr) {

// 	}	
// });

$(window).resize(function () {
	if ($(window).width()<350) {
		$("#upload-container").css({
			"margin":"0"
		})
	}
	else{
		$("#upload-container").css({
			"margin-left":"45%"
		})
	}
})


