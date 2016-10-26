var screenW = $(window).width();
var secsPortal = $("#sections-portal");
var secsPortalDivs = $("#sections-portal div");
// var footer = $("footer");
// var title = $("#title");

function adjusts() {
	screenW = $(window).width();
	if (screenW >= 1200) { // SOMENTE PARA TELAS GRANDES (DESKTOP)
		

	} else if (screenW >= 992) { // SOMENTE PARA TELAS MEDIAS (DESKTOP)
		

	} else if (screenW >= 768) { // SOMENTE PARA TELAS PEQUENAS (TABLETS)
		// title.css({
		// 	"font-size":"28px"
		// });

		secsPortal.css({
			"margin-top":"180px"
		});

		$("#sec-gasto").css({
			"border-right": "5px solid rgb(45,45,45)"
		});

		$("#sec-setor").css({
			"border-left": "5px solid rgb(45,45,45)"
		});

		$("#sec-usuario").css({
			"border-left": "5px solid rgb(45,45,45)"
		});

		$("#sec-advertencia").css({
			"border-right": "5px solid rgb(45,45,45)"
		});

		$("#sec-computador").css({
			"border-left": "5px solid rgb(45,45,45)"
		});

	} else if (screenW <  768) { // SOMENTE PARA TELAS MUITO PEQUENAS (CELULAR)
		secsPortalDivs.css({
			"border":"none"
		});
		
		secsPortal.css({
			"margin-top":"20px"
		});

		// title.css({
		// 	"font-size":"28px",
		// 	"margin-left":"7%"
		// });
	}
};

adjusts();

$(window).resize(function (){adjusts()});

if (screenW >= 768) { // PARA TELAS PEQUENAS OU MAIORES
	// footer.css({
	// 	"top":$(document).height() - 140
	// });
} else {
	// footer.css({
	// 	"top":$(document).height() - 60
	// });
}