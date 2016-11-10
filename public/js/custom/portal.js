
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

var mask = $("#mask-container");
var chart = $("nvd3");
function resizeMask(chart){
	$("#mask-container").css({
		"top":chart.offset().top+50,
		"left":chart.offset().left
	});
}

mask.fadeOut();

mask.mouseover(function() {
	mask.css({
		"z-index":"-1"
	});
	mask.find("h2").fadeOut();
});

$("#container-chart").mouseout(function() {
	mask.css({
		"z-index":"2"
	});
	mask.find("h2").fadeIn();
});