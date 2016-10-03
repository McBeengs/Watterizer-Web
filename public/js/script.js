  var canvas = new fabric.Canvas('c');

    $("#sala1").click(function(){
       var rect = new fabric.Rect({
          left: 500,
          top: 150,
          stroke: 'black',
          fill: 'transparent',
          strokeWidth: 5,
          width: 500,
          height: 500

      });

       canvas.add(rect);
       canvas.renderAll();
   });

    $("#pc1").click(function(){

        fabric.Image.fromURL('../img/images.jpg', function(img){
            img.setWidth(70);
            img.setHeight(70);
            img.crossOrigin = "Anonymous";
            img.set("nome",$("#texto1").val());
            canvas.add(img);
        }
        );
    });
    canvas.observe('mouse:over', function (evento) {
        showImageTools(evento);
        console.log(evento);

    });
    canvas.observe('mouse:out', function (evento) {
        $('#janela1').hide();
    });
    function showImageTools (evento) {
        $("#janela1").html(evento.target.nome);

        moveImageTools(evento);
    };

    function moveImageTools (evento) {
        var w = $('#janela1').width();
        var h = $('#janela1').height();
        var e = evento;
    // -1 because we want to be inside the selection body
    var top = evento.target.top;
    var left = evento.target.left;
    $('#janela1').show();
    $('#janela1').css({top: top, left: left});
}


var saveImg;
var saveImgJson=[];
var setores=[];

$("#saveImg1").click(function() {
	$( "#setores1 option:selected" ).each(function() {
      saveImgJson.push(JSON.stringify(canvas.toDatalessJSON())) ;
      setores.push($( this ).text()) ;
  });
	saveImg = JSON.stringify(canvas);
});

$("#loadImg1").click(function(){

 console.log("sdfgdfg");
});


$("#downloadImg1").click(function(){

	/*canvas.deactivateAll().renderAll();  
  window.open(canvas.toDataURL('png')); 
  canvas.renderAll();*/

  canvas.isDrawingMode = false;

  if(!window.localStorage){alert("This function is not supported by your browser."); return;}
    // to PNG
    window.open(canvas.toDataURL('png'));
});





$("#deleteImg1").click(function(){
    var activeObject = canvas.getActiveObject(),
    activeGroup = canvas.getActiveGroup();
    if (activeObject) {
        if (confirm('Are you sure?')) {
            canvas.remove(activeObject);
        }
    }
    else if (activeGroup) {
        if (confirm('Are you sure?')) {
            var objectsInGroup = activeGroup.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach(function(object) {
                canvas.remove(object);
            });
        }
    }

    canvas.renderAll();

});



$(function(){

    $('#zoomIn1').click(function(){
        canvas.setZoom(canvas.getZoom() * 1.1 ) ;
    }) ;
    
    $('#zoomOut1').click(function(){
        canvas.setZoom(canvas.getZoom() / 1.1 ) ;
    }) ;
    
    $('#goRight1').click(function(){
        var units = 10 ;
        var delta = new fabric.Point(units,0) ;
        canvas.relativePan(delta) ;
    }) ;
    
    $('#goLeft1').click(function(){
        var units = 10 ;
        var delta = new fabric.Point(-units,0) ;
        canvas.relativePan(delta) ;
    }) ;
    $('#goUp1').click(function(){
        var units = 10 ;
        var delta = new fabric.Point(0,-units) ;
        canvas.relativePan(delta) ;
    }) ;
    
    $('#goDown1').click(function(){
        var units = 10 ;
        var delta = new fabric.Point(0,units) ;
        canvas.relativePan(delta) ;
    }) ;
    
}) ;

$("#porta1").click(function(){
	fabric.Image.fromURL('../img/porta.png', function(img){
		img.setWidth(100);
		img.setHeight(100);

		canvas.add(img);
		canvas.renderAll();
	});
});

$( "#setores1" ).change(function() {
  /*alert( $( "#setores option:selected" ).text());*/
  canvas.clear();
  for (var i = setores.length - 1; i >= 0; i--) {
    if (setores[i]== $( "#setores1 option:selected" ).text()) {
        canvas.loadFromJSON(saveImgJson[i]);  
    };
};
setTimeout(function () {
    canvas.renderAll();
},50);

});

