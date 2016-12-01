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
$(window).resize(function() {
    // if ($(window).width()<350) {
    // 	$("#upload-container").css({
    // 		"margin":"0"
    // 	})
    // }
    // else{
    // 	$("#upload-container").css({
    // 		"margin-left":"45%"
    // 	})
    // }
    sizeAdjusts();
});

sizeAdjusts();

function sizeAdjusts() {
    $("header").css({
        "width": $(window).width()
    });
}

var mask = $("#container-mask");
var chart = $("nvd3");

function resizeMask(chart) {
    $("#container-mask").css({
        "top": chart.offset().top - 100,
        "left": chart.offset().left
    });
}
$("#div").css({
    "margin-top": $("#all-arround-chart").offset().top - 200
})

mask.fadeOut();

mask.mouseover(function() {
    mask.css({
        "z-index": "-1"
    });
    mask.find("h2").fadeOut();
});

$("#blur").mouseover(function() {
    mask.css({
        "z-index": "2"
    });
    mask.find("h2").fadeIn();
});

$("#container-chart").mouseout(function() {
    mask.css({
        "z-index": "2"
    });
    mask.find("h2").fadeIn();
});