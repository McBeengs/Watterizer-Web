  var canvas = new fabric.Canvas('c');

    $("#sala").click(function(){
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

    $("#pc").click(function(){

        fabric.Image.fromURL('../img/images.jpg', function(img){
            img.setWidth(70);
            img.setHeight(70);
            img.set("nome",$("#texto").val());
            canvas.add(img);
            canvas.renderAll();
        }
        );

    });
    canvas.observe('mouse:over', function (evento) {
        showImageTools(evento);
        console.log(evento);

    });
    canvas.observe('mouse:out', function (evento) {
        $('#janela').hide();
    });
    function showImageTools (evento) {
        $("#janela").html(evento.target.nome);

        moveImageTools(evento);
    };

    function moveImageTools (evento) {
        var w = $('#janela').width();
        var h = $('#janela').height();
        var e = evento;
    // - because we want to be inside the selection body
    var top = evento.target.top;
    var left = evento.target.left;
    $('#janela').show();
    $('#janela').css({top: top, left: left});
}


var saveImg;
var saveImgJson=[];
var setores=[];

$("#saveImg").click(function() {
	$( "#setores option:selected" ).each(function() {
      saveImgJson.push(JSON.stringify(canvas.toDatalessJSON())) ;
      setores.push($( this ).text()) ;
  });
	saveImg = JSON.stringify(canvas);
});

$("#loadImg").click(function(){

 console.log("sdfgdfg");
});


$("#downloadImg").click(function(){

	/*canvas.deactivateAll().renderAll();  
  window.open(canvas.toDataURL('png')); 
  canvas.renderAll();*/

  canvas.isDrawingMode = false;

  if(!window.localStorage){alert("This function is not supported by your browser."); return;}
    // to PNG
    window.open(canvas.toDataURL('png'));
});





$("#deleteImg").click(function(){
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

    $('#zoomIn').click(function(){
        canvas.setZoom(canvas.getZoom() * 1.1 ) ;
    }) ;
    
    $('#zoomOut').click(function(){
        canvas.setZoom(canvas.getZoom() / 1.1 ) ;
    }) ;
    
    $('#goRight').click(function(){
        var units = 10 ;
        var delta = new fabric.Point(units,0) ;
        canvas.relativePan(delta) ;
    }) ;
    
    $('#goLeft').click(function(){
        var units = 10 ;
        var delta = new fabric.Point(-units,0) ;
        canvas.relativePan(delta) ;
    }) ;
    $('#goUp').click(function(){
        var units = 10 ;
        var delta = new fabric.Point(0,-units) ;
        canvas.relativePan(delta) ;
    }) ;
    
    $('#goDown').click(function(){
        var units = 10 ;
        var delta = new fabric.Point(0,units) ;
        canvas.relativePan(delta) ;
    }) ;
    
}) ;

$("#porta").click(function(){
	fabric.Image.fromURL('../img/porta.png', function(img){
		img.setWidth(100);
		img.setHeight(100);

		canvas.add(img);
		canvas.renderAll();
	});
});

$( "#setores" ).change(function() {
  /*alert( $( "#setores option:selected" ).text());*/
  canvas.clear();
  for (var i = setores.length - 1; i >= 0; i--) {
    if (setores[i]== $( "#setores option:selected" ).text()) {
        canvas.loadFromJSON(saveImgJson[i]);  
    };
};
setTimeout(function () {
    canvas.renderAll();
},50);

});

