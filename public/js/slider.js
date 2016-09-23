//SLIDER
var title = document.getElementById("title");
var divTexts = document.getElementById("div-texts");
var text = document.getElementById("text");
var c = 0;

// SURGIMENTO DO TEXTO DE INTRODUÇÃO
setTimeout(function(){
	$(title).css({opacity: "1", "margin-top": "190px", transition: "1s"});
	$(text).css({opacity: "1", "margin-top": "20px", transition: "1s"});
	$(divTexts).css({width: "50%", transition: "1s"});
}, 500);

// TROCA DE IMAGENS
var slider = $("#slider");
var sliderText = $("#slider-text");

// TROCA A IMAGEM E MUDA A COR DO TEXTO
function atualizar(url, cor){
	slider.css({
		"background-image":"url('img/slider-main/bg"+url+".jpg')", transition:"1s ease-in-out"
	});
	sliderText.css({
		"color":cor, transition:"1s ease-in-out"
	});
}

// DEFINE O PRÓXIMO INDICE DO SLIDER
var i = 1;
setInterval(function(){
	if(i<4){
		i++;
	}
	else{
		i=1;
	}
	if (i%2 == 0) {
		atualizar(i, "black");
	} else {
		atualizar(i, "white");
	}
}, 4500);