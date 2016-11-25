/* CRIA O CANVAS */
var canvas = new fabric.Canvas(
    'canvas-drawer', {
        selection: true,
        controlsAboveOverlay: true,
        centeredScaling: false,
        allowTouchScrolling: false

    }
);
var scope;
var setores;
canvas.setBackgroundColor('rgb(224, 224, 224)', canvas.renderAll.bind(canvas));
setTimeout(function () {
    scope = angular.element($("body")).scope();
    setores = scope.setores;
    console.log(setores);
}, 500);

// RESPONSIVIDADE
$(document).ready(function() {
    canvas.setWidth($(window).width());
    $(window).resize(function() {
        canvas.setWidth($(window).width());
    });
});

var canvasToLoad;
function loadCanvas(id) {
    setTimeout(function () {
        canvas.clear();
        for (var i = setores.length - 1; i >= 0; i--) {
            if (setores[i].id = id){
                canvasToLoad = setores[i].canvas;
            }
        }
    }, 200);
};

var lastCanvas;
// CARREGA O CANVAS SELECIONADO
$("#slt-setores").change(function() {
    saveCanvas();
    setTimeout(function() {
        lastCanvas = $("#slt-setores").val();
    }, 300);
    loadCanvas($("#slt-setores").val().substr($("#slt-setores").val().lastIndexOf(":")+1,$("#slt-setores").val().length-1));
    setTimeout(function() {
        canvas.renderAll();
    }, 50);
});

/* EVENT LISTENERS DO CANVAS */

var target;
var lastTarget;

// LIMITE DE BORDAS
canvas.on('object:moving', function(e) {
    var obj = e.target;

    if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        return;
    }

    obj.setCoords();
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
    }

    if (obj.getBoundingRect().top + obj.getBoundingRect().height > canvas.height) {
        obj.top = canvas.height - obj.getBoundingRect().height
    }

    if (obj.getBoundingRect().left + obj.getBoundingRect().width > canvas.width) {
        obj.left = canvas.width - obj.getBoundingRect().width
    }

});

// AO SELECIONAR UM OBJETO
canvas.on("options:selected", function(options) {});

// AO CLICAR DUAS VEZES
var timer;
canvas.observe('mouse:down', function(options) {
    HideMenu();
    if (options.target) {
        var date = new Date();
        var timeNow = date.getTime();
        if (timeNow - timer > 500) {

            if (canvas.getActiveObject().crossOrigin == null || canvas.getActiveObject().crossOrigin == undefined) {
                canvas.deactivateAll();
                canvas.renderAll();
            }
        }

        timer = timeNow;
    }
});

//REMOVENDO ITEM CONTEXT-MENU
$("#remover").click(function() {
    del();
});

// AO PASSAR O MOUSE EM CIMA
canvas.observe('mouse:over', function(evento) {

    if (evento.target) {
        target = evento.target;

        if (evento.target.crossOrigin != null || evento.target.crossOrigin != undefined) {
            // showImageTools(evento);
            canvas.renderAll();
        }
    }
});

// AO MOVER UM OBJETO
canvas.observe('object:moving', function(evento) {
    $('#janela').hide();
});

// AO TIRAR O MOUSE DE CIMA
canvas.observe('mouse:out', function(evento) {
    target = false;
    $('#janela').hide();
});

/* FUNCIONAMENTO DOS BOTÕES */

// CONFIGURAÇÕES DE ZOOM
var canvasScale = 1;
var scaleFactor = 1.1;

$(function() {
    // ZOOM +
    $('#btn-zoom-in').click(function() {
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
    $('#btn-zoom-out').click(function() {
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
$("#btn-create-box").click(function() {
    createBox();
});
function createBox() {
    var rect = new fabric.Rect({
        left: 10 * canvasScale,
        top: 10 * canvasScale,
        hasRotatingPoint: false,
        stroke: 'black',
        fill: 'transparent',
        strokeWidth: 2,
        width: 300 * canvasScale,
        height: 300 * canvasScale

    });
    canvas.add(rect);
    canvas.renderAll();
}

// CRIA UMA PORTA
$("#btn-create-door").click(function() {
    createDoor();
});
function createDoor() {
    fabric.Image.fromURL('/img/canvas-icons/door-icon.png', function(img) {
        img.id = null;
        img.setWidth(100 * canvasScale);
        img.setHeight(100 * canvasScale);
        img.crossOrigin = null;
        canvas.add(img);
        canvas.renderAll();
    });
}

// ADICIONA UM PC COM TEXTO
var idimg = 0;
$("#btn-create-pc").click(function() {
    createPc();
});
function createPc() {
    idimg++;
    if ($("#slt-pc").val() != '') {
        var textoSel = $("#slt-pc option:selected").text();
        var idSel = $("#slt-pc option:selected").val();
        $("#slt-pc option:selected").remove();
        var pcSelecionado;
        fabric.Image.fromURL('/img/canvas-icons/pc-icon.png', function(img) {
            var text = new fabric.Text(textoSel, {
                fontFamily: 'Arial',
                fontSize: 20,
            });
            var group = new fabric.Group([img, text], {
                left: 10 * canvasScale,
                top: 10 * canvasScale,
            });
            group.id = idSel;
            img.id = idimg;
            group.setWidth(70 * canvasScale);
            group.setHeight(70 * canvasScale);
            img.setWidth(70 * canvasScale);
            img.setHeight(70 * canvasScale);
            text.setHeight(70 * canvasScale);
            text.setWidth(70 * canvasScale);
            text.setLeft(-13 - text.text.length * 4);
            text.setTop(20);
            img.setTop();
            img.setLeft();
            text.setTextAlign("center center");
            group.setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
                bl: false,
                br: false,
                tl: false,
                tr: false,
                mtr: true
            });
            img.crossOrigin = {id:idSel, nome:textoSel};
            textoSel = lastTarget;
            group.angle=0;
            canvas.add(group);
        });
    }
    saveCanvas();
}

//EDITANDO NOME PC
$("#editar").click(function editar() {
    var texto2 = $("#txt-new-name-pc").val();

    if (texto2 != "") {
        alert("antigo texto " + lastTarget.crossOrigin)
        lastTarget.crossOrigin = texto2;
        alert("novo texto " + lastTarget.crossOrigin)
    } else {
        alert("necessário colocar um novo")
    }
});

// DELETA O OBJETO SELECIONADO
$("#btn-canvas-obj-delete").click(function() {
    del();
});

//ATALHOS DO TECLADO

createListenersKeyboard();

function createListenersKeyboard() {
    document.onkeydown = onKeyDownHandler;
    //document.onkeyup = onKeyUpHandler;
}

function onKeyDownHandler(event) {
    //event.preventDefault();

    var key;
    if (window.event) {
        key = window.event.keyCode;
    } else {
        key = event.keyCode;
    }

    switch (key) {
        //Del (Delete)
        case 46: // Delete
            if (ableToShortcut()) {
                del();
            }
            break;
            //Selecionar tudo (Crtl+z)
        case 90: // Ctrl+Z
            if (ableToShortcut()) {
                if (event.ctrlKey) {
                    event.preventDefault();
                    undo();
                    return false;
                }
            }
            break;
        case 89: // Ctrl+y
            if (ableToShortcut()) {
                if (event.ctrlKey) {
                    event.preventDefault();
                    redo();
                }
            }
            break;
        case 83: // Ctrl+s
            if (ableToShortcut()) {
                if (event.ctrlKey) {
                    event.preventDefault();
                    saveCanvas();
                }
            }
            break;

        default:
            // TODO
            break;
    }
}


function ableToShortcut() {
    return true;
}

//SALVA O ESTADO DO OBJETO

var current;
var list = [];
var state = [];
var index = 0;
var index2 = 0;
var action = false;
var refresh = true;

canvas.on("object:added", function(e) {
    var object = e.target;

    if (action === true) {
        state = [state[index2]];
        list = [list[index2]];

        action = false;
        index = 1;
    }
    object.saveState();
    state[index] = JSON.stringify(object.originalState);
    list[index] = object;
    index++;
    index2 = index - 1;

    refresh = true;
});

//SALVA ESTADO DO OBJETO EM JSON

canvas.on("object:modified", function(e) {
    var object = e.target;

    if (action === true) {
        state = [state[index2]];
        list = [list[index2]];

        action = false;
        index = 1;
    }

    object.saveState();

    state[index] = JSON.stringify(object.originalState);
    list[index] = object;
    index++;
    index2 = index - 1;
    refresh = true;
    object.crossOrigin;
    if (object._objects!=undefined){
        saveCanvas();
    }
});

//UNDO FUNCTION

function undo() {

    if (index <= 0) {
        index = 0;
        return;
    }

    if (refresh === true) {
        index--;
        refresh = false;
    }

    index2 = index - 1;
    current = list[index2];
    current.setOptions(JSON.parse(state[index2]));

    index--;
    current.setCoords();
    canvas.renderAll();
    action = true;
}

//REDO FUNCTION

function redo() {

    action = true;
    if (index >= state.length - 1) {
        return;
    }

    index2 = index + 1;
    current = list[index2];
    current.setOptions(JSON.parse(state[index2]));

    index++;
    current.setCoords();
    canvas.renderAll();
}


function del() {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeGroup) {
        if (confirm('Tem certeza ?')) {
            var objectsInGroup = activeGroup.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach(function(object) {
                canvas.remove(object);
            });
        }
    } else if (activeObject) {
        console.log(activeObject);
        if (confirm('Tem certeza ?')) {
            if (activeObject._objects[0].id!=undefined){
                scope.removePc(activeObject._objects[0].id);
                saveCanvas();
            }
            canvas.remove(activeObject);
        }
    } 
    canvas.renderAll();
}
var obj;
function saveCanvas() {
    if (lastCanvas!=undefined && lastCanvas!=undefined){
        setTimeout(function () {
            console.log(canvas._objects);
            canvasToSave = {
                canvasScale:canvasScale,
                objects:{
                    pcs:[],
                    doors:[],
                    boxes:[]
                }
            }
            for (var i = canvas._objects.length - 1; i >= 0; i--) {
                obj = canvas._objects[i]
                if (obj.id!=null && obj.id!=undefined) {
                    canvasToSave.objects.pcs.push({
                        id:obj.id,
                        top:obj.top,
                        left:obj.left,
                        angle:obj.angle,
                        text:obj._objects[1].text
                    });
                } else if (obj.id == null) {
                    canvasToSave.objects.doors.push({
                        scaleX:obj.scaleX,
                        scaleY:obj.scaleY,
                        angle:obj.angle,
                        top:obj.top,
                        left:obj.left
                    });
                } else {
                    canvasToSave.objects.boxes.push({
                        scaleX:obj.scaleX,
                        scaleY:obj.scaleY,
                        top:obj.top,
                        left:obj.left
                    });
                }
                scope.saveCanvas(lastCanvas, canvasToSave);
            }
            // var savedCanvas = JSON.stringify(canvas.toJSON());
            // scope.saveCanvas($("#slt-setores").val(), savedCanvas);
            // console.log($("#slt-setores").val(), savedCanvas);
        }, 200);
    }
};

// SALVA AS COORDENADAS DO CANVAS NO BANCO DE DADOS
var currentCanvas;
$("#btn-canvas-save").click(function() {
    saveCanvas();
});

// BAIXA A IMAGEM DO CANVAS
$("#btn-canvas-download").click(function() {
    canvas.isDrawingMode = false;
    if (!window.localStorage) {
        alert("Essa função não é suportada pelo seu navegador.");
        return;
    }
    window.open(canvas.toDataURL('png'));
});

$(document).bind("contextmenu", function(e) {
    HideMenu();
    return true;
});

var out = 0;

//DESATIVAR MENU DE CONTEXTO
$(document).ready(function() {
    $('canvas').bind("contextmenu", function(e) {
        if (target) {
            lastTarget = target;
            mostrarMenu(e)
            canvas.setActiveObject(target)
        }

        return false;
    });
});

//MOSTRAR MENU DE CONTEXTO PERSONALIZADO
function mostrarMenu(event) {

    var X = event.clientX;
    var Y = event.clientY;

    var menu = document.getElementById("context-menu");

    menu.style.top = Y.toString() + "px";
    menu.style.left = X.toString() + "px";
    menu.style.display = "block";

    //CONTEXT-MENU
    if (target.id == null || target.id == undefined) {
        $("#editar").hide();
        $("#txt-new-name-pc").hide();
        $("#desligar").hide();
    } else {
        $("#editar").show();
        $("#txt-new-name-pc").show();
        $("#desligar").show();
    }

}

//Rodar imagens
function rotateObject(angleOffset) {
    var obj = canvas.getActiveObject(),
        resetOrigin = false;

    if (!obj) return;

    var angle = obj.getAngle() + angleOffset;

    if ((obj.originX !== 'center' || obj.originY !== 'center') && obj.centeredRotation) {
        obj.setOriginToCenter && obj.setOriginToCenter();
        resetOrigin = true;
    }

    angle = angle > 360 ? 90 : angle < 0 ? 270 : angle;

    obj.setAngle(angle).setCoords();

    if (resetOrigin) {
        obj.setCenterToOrigin && obj.setCenterToOrigin();
    }

    canvas.renderAll();
}

fabric.util.addListener(document.getElementById('esquerda'), 'click', function rodarEsquerda() {
    rotateObject(-90);
});
fabric.util.addListener(document.getElementById('direita'), 'click', function rodarDireita() {
    rotateObject(90);
});

fabric.Object.prototype.setOriginToCenter = function() {
    this._originalOriginX = this.originX;
    this._originalOriginY = this.originY;

    var center = this.getCenterPoint();

    this.set({
        originX: 'center',
        originY: 'center',
        left: center.x,
        top: center.y
    });
};

fabric.Object.prototype.setCenterToOrigin = function() {
    var originPoint = this.translateToOriginPoint(
        this.getCenterPoint(),
        this._originalOriginX,
        this._originalOriginY);

    this.set({
        originX: this._originalOriginX,
        originY: this._originalOriginY,
        left: originPoint.x,
        top: originPoint.y
    });

};

function HideMenu() {
    $("#context-menu").css({
        "display": "none"
    });
}

canvas.observe('object:moving', function(evento) {
    $('#context-menu').hide();

});

canvas.observe('mouse:out', function(evento) {
    target = false;
    // $('#context-menu').hide();
});

//SEGURANDO
// var mouseDown = 0;
// document.body.onmousedown = function() { 
//     mouseDown = 1;
// }
// document.body.onmouseup = function() {
//     mouseDown = 0;
// }