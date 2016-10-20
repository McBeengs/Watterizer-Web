/* CRIA O CANVAS */
var canvas = new fabric.Canvas(
    'canvas-drawer',
    {
        selection : true,
        controlsAboveOverlay:true,
        centeredScaling:false,
        allowTouchScrolling: false

    }
);

canvas.setDimensions({
    width: window.innerWidth,
    height: window.innerHeight/1.75
});

canvas.setBackgroundColor('rgb(224, 224, 224)', canvas.renderAll.bind(canvas));

/* EVENT LISTENERS DO CANVAS */

var target;

// AO MOVER UM OBJETO
canvas.on('object:moving', function (e) {
    var obj = e.target;

    if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        return ;
    }

    obj.setCoords();
    if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0 ) {
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);       
    }

    if(obj.getBoundingRect().top+obj.getBoundingRect().height > canvas.height) {
        obj.top = canvas.height-obj.getBoundingRect().height      
    }

    if (obj.getBoundingRect().left+obj.getBoundingRect().width > canvas.width) {
        obj.left = canvas.width-obj.getBoundingRect().width
    }
});

// AO SELECIONAR UM OBJETO
canvas.on("options:selected", function (options) {

});

// AO CLICAR DUAS VEZES
var timer;
canvas.observe('mouse:down', function (options) {
    HideMenu();
    if (options.target) {
        var date = new Date();
        var timeNow = date.getTime();
        if(!timeNow - timer < 500) {
            if (canvas.getActiveObject().crossOrigin==null || canvas.getActiveObject().crossOrigin==undefined) {
                canvas.deactivateAll();
                canvas.renderAll();
            }
        }
        timer = timeNow;
    }
});

// AO PASSAR O MOUSE EM CIMA
canvas.observe('mouse:over', function (evento) {
    if (evento.target) {
        target = evento.target;
        if (evento.target.crossOrigin!=null || evento.target.crossOrigin!=undefined) {
            showImageTools(evento);
            canvas.renderAll();
        }
    }
});

// AO MOVER UM OBJETO
canvas.observe('object:moving', function (evento) {

});

// AO TIRAR O MOUSE DE CIMA
canvas.observe('mouse:out', function (evento) {
    target=false;
});

/* FUNCIONAMENTO DOS BOTÕES */

// CONFIGURAÇÕES DE ZOOM
var canvasScale = 1;
var scaleFactor = 1.01;

$(function () {
    // ZOOM +
    $('#btn-zoom-in').click(function () {
        canvasScale = canvasScale * scaleFactor;
        var objects = canvas.getObjects();
        for (var i in objects) {
            var scaleX = objects[i].scaleX;
            var scaleY = objects[i].scaleY;
            var left = objects[i].left;
            var top = objects[i].top;

            var tempScaleX = scaleX * scaleFactor;
            var tempScaleY = scaleY * scaleFactor;
            var tempLeft = left * scaleFactor;
            var tempTop = top * scaleFactor;

            objects[i].scaleX = tempScaleX;
            objects[i].scaleY = tempScaleY;
            objects[i].left = tempLeft;
            objects[i].top = tempTop;

            objects[i].setCoords();
        }
        canvas.renderAll();
    });

    // ZOOM -
    $('#btn-zoom-out').click(function () {
        canvasScale = canvasScale / scaleFactor;
        var objects = canvas.getObjects();
        for (var i in objects) {
            var scaleX = objects[i].scaleX;
            var scaleY = objects[i].scaleY;
            var left = objects[i].left;
            var top = objects[i].top;

            var tempScaleX = scaleX * (1 / scaleFactor);
            var tempScaleY = scaleY * (1 / scaleFactor);
            var tempLeft = left * (1 / scaleFactor);
            var tempTop = top * (1 / scaleFactor);

            objects[i].scaleX = tempScaleX;
            objects[i].scaleY = tempScaleY;
            objects[i].left = tempLeft;
            objects[i].top = tempTop;

            objects[i].setCoords();
        }
        canvas.renderAll();
    });

});

// CRIA UM DIVISOR
$("#btn-create-box").click(function () {
    var rect = new fabric.Rect({
        left: 500,
        top: 150,
        hasRotatingPoint: false,
        stroke: 'black',
        fill: 'transparent',
        strokeWidth: 2,
        width: 500,
        height: 500

    });
    canvas.add(rect);
    canvas.renderAll();
});

// CRIA UMA PORTA
$("#btn-create-door").click(function () {
    fabric.Image.fromURL('img/porta.png', function (img) {
        img.setWidth(100);
        img.setHeight(100);
        img.crossOrigin = null;
        canvas.add(img);
        canvas.renderAll();
    });
});

// ADICIONA UM PC
$("#btn-create-pc").click(function(){
    var texto= $("#texto").val();
    if (texto!="") {
        fabric.Image.fromURL('img/images.png', function (img) {
            img.setWidth(70*canvasScale);
            img.setHeight(70*canvasScale);

            img.setControlsVisibility({
                mt:false,
                mb:false,
                ml:false,
                mr:false,
                bl:false,
                br:false,
                tl:false,
                tr:false,
                mtr:true
            });
            img.crossOrigin = texto;
            canvas.add(img);
        });
    }
    else {
        alert("É necessário inserir um nome no PC")
    }
});

// DELETA O OBJETO SELECIONADO
$("#btn-canvas-obj-delete").click(function(){
    var activeObject = canvas.getActiveObject(),
    activeGroup = canvas.getActiveGroup();
    if (activeObject) {
        if (confirm('Tem certeza ?')) {
            canvas.remove(activeObject);
        }
    }
    else if (activeGroup) {
        if (confirm('Tem certeza ?')) {
            var objectsInGroup = activeGroup.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach( function (object) {
                canvas.remove(object);
            });
        }
    }
    canvas.renderAll();
});

// SALVA AS COORDENADAS DO CANVAS NO BANCO DE DADOS
var currentCanvas;
var savedCanvas=[];
$("#btn-canvas-save").click(function() {
    $("#setores option:selected").each(function() {
        savedCanvas.push(JSON.stringify(canvas.toJSON()));
        setores.push($( this ).text()) ;
    });
    currentCanvas = JSON.stringify(canvas);
});

// BAIXA A IMAGEM DO CANVAS
$("#btn-canvas-download").click(function(){
    canvas.isDrawingMode = false;
    if (!window.localStorage) {
        alert("Essa função não é suportada pelo seu navegador."); 
        return;
    }
    window.open(canvas.toDataURL('png'));
});

// CARREGA O CANVAS SELECIONADO
var setores=[];
$("#slt-setores").change(function () {
    canvas.clear();
    for (var i = setores.length - 1; i >= 0; i--) {
        if (setores[i]== $("#slt-setores option:selected").text()) {
            canvas.loadFromJSON(savedCanvas[i]);
        }
    }
    setTimeout(function () {
        canvas.renderAll();
    },50);
});

$("#canvas-drawer").bind("contextmenu",function(e){
    if (target) {
        if (target.crossOrigin!=null || target.crossOrigin!=undefined) {
            canvas.deactivateAll();
            ShowMenu(e);
            return false;
        }
    }
});

$(document).bind("contextmenu",function (e) {
    HideMenu();
    return true;
});

function ShowMenu(objeto) {
    var posX = objeto.clientX + window.pageXOffset +'px'; //Left Position of Mouse Pointer
    var posY = objeto.clientY + window.pageYOffset + 'px'; //Top Position of Mouse Pointer
    $("#context-menu").css({
        "position":"absolute",
        "display":"inline",
        "left":posX,
        "top":posY
    });          
}

function HideMenu() {
    $("#context-menu").css({
        "display":"none"
    });
}
// responsive();
// window.addEventListener('resize', responsive);

// function responsive() {
//     var windowWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);
//     var windowHeight = ((window.innerHeight > 0) ? window.innerHeight : screen.height);
//     canvas.setDimensions({
//         width: windowWidth,
//         height: windowHeight
//     });
// };