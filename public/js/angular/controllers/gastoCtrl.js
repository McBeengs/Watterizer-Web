// CONTROLLER DE GASTOS
app.requires.push('nvd3');
app.controller("gastoCtrl", function($rootScope, $scope, $http, $interval, $timeout) {
    var socket
    var intervalo = setInterval(function() {
            if ($scope.load) {
                setTimeout(function() {
                    socket = io.connect($scope.ip + ':1515');
                }, 100);
                $http.get("/dados/gasto/mensal/")
                    .then(function(response) {
                        $rootScope.gastosMes = [];
                        var meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dec"]
                        for (var i = 0; i <= response.data.length - 1; i++) {
                            $rootScope.gastosMes.push({
                                x: meses[i],
                                y: Number(response.data[i])
                            });
                        }
                        $rootScope.i = i;
                        $timeout(function() {
                            $scope.createChartMes($rootScope.gastosMes);
                        }, 500);
                    });
                clearInterval(intervalo);
            }
        }, 0)
        // CRIA O GRÁFICO
    $scope.createChartMes = function(data) {
        $scope.chartMes = {};
        // CONFIGURAÇÕES DO GRÁFICO
        $scope.chartMes.options = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 80
                },
                x: function(d) {
                    return d.x;
                },
                y: function(d) {
                    return d.y;
                },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e) {
                        console.log("stateChange");
                    },
                    changeState: function(e) {
                        console.log("changeState");
                    },
                    tooltipShow: function(e) {
                        console.log("tooltipShow");
                    },
                    tooltipHide: function(e) {
                        console.log("tooltipHide");
                    }
                },
                xAxis: {
                    axisLabel: 'Mes'
                },
                yAxis: {
                    axisLabel: 'Kilowatts (kw)',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart) {
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Consumo Mensal',
                css: {
                    'color': 'white',
                    'font-size': '24px'
                }
            },
            subtitle: {
                enable: false,
                html: "",
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px',
                    'color': 'white'
                }
            },
            caption: {
                enable: false,
                html: '',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        // DADOS NO GRÁFICO
        $scope.chartMes.data = createChartData(data);

        function createChartData(data) {
            // LIMITA A QUANTIDADE DE DADOS
            var limit = 40;
            if (data != null) {
                data.splice(0, data.length - limit);
            } else {
                data = [{
                    x: 0,
                    y: 0
                }];
            }

            // ARRAY DE OBJETOS RETORNADO
            return [
                // LINHA PRINCIPAL
                {
                    values: data,
                    key: 'Hoje',
                    color: '#FFC814'
                }
            ];
        };
        setTimeout(function() {
            $("text").css({
                "fill": "white"
            });
            $("g.nv-y .nv-axislabel").attr("y", "-60")
        }, 1);
    };
    $timeout(function() {
        // CONECTA AO SOCKET

        var active = false;

        // PEGA OS SETORES DO BANCO DE DADOS
        $http.get("/setor/arduino")
            .then(function(response) {
                $scope.setores = response.data;
                console.log($scope.setores)
            });

        // INICIA A FORMAÇÃO DO GRÁFICO QUANDO UM ARDUÍNO FOR SELECIONADO
        $scope.startChart = function() {
            // PEGA OS GASTOS DO BANCO DE DADOS
            $http.get("/dados/gasto/equipamento/" + $scope.equipSel)
                .then(function(response) {
                    $rootScope.gastos = [];
                    for (var i = 0; i <= response.data.length - 2; i++) {
                        $rootScope.gastos.push({
                            x: i,
                            y: Number(response.data[i].substr(response.data[i].lastIndexOf("\'") + 1))
                        });
                    }
                    $rootScope.i = i;
                    $timeout(function() {
                        $scope.getRecentData();
                    }, 200);

                });

            $http.get("/dados/gasto/custo/" + $scope.equipSel)
                .then(function(response) {
                    $rootScope.custo = response.data[0].custo
                    console.log($rootScope.custo)
                });
        }

        // PEGA OS DADOS TEMPORÁRIOS NO SERVIDOR
        $scope.getRecentData = function() {
            // ENVIA EVENTO LOAD AO SOCKET
            socket.emit("load", $scope.equipSel);
            socket.on('toClientLoad', function(data) {
                if (data.custo != undefined) {
                    $rootScope.custo += Number(data.custo);
                };

                // CASO OS GASTOS SEJAM NULOS
                if (data.gasto == null) {
                    console.log('null');
                    data.gasto = [];
                }
                // CRIA A ARRAY
                for (j = 0; j <= data.gasto.length - 1; j++) {
                    $scope.gastos.push({
                        x: $rootScope.i,
                        y: Number(data.gasto[j].substr(data.gasto[j].lastIndexOf("\'") + 1))
                    });
                    $rootScope.i++;
                }

                $timeout(function() {
                    $scope.createChart($scope.gastos);
                }, 500);
            });
        }

        // LISTENER PARA DADOS DO SOCKET
        socket.on('toClient', function(data) {
            // FILTRA PARA INSERIR APENAS OS VALORES DO ARDUÍNO SELECIONADO
            if (data.equipamento == $scope.equipSel) {
                $scope.gastos.push({
                    x: $rootScope.i,
                    y: data.gasto
                });
                active = true;
                $timeout(function() {
                    $scope.createChart($scope.gastos);
                }, 1000);
                $rootScope.i++;
                for (var i = data.custo.length - 1; i >= 0; i--) {
                    $scope.custo += data.custo[i]
                };

            }
        });

        // ADICIONA E REMOVE MÁSCARA QUE INDICA ATIVIDADE
        $interval(function() {
            if (active == false) {
                $("#container-mask").fadeIn();
                $("text.nvd3.nv-noData").remove();
            } else {
                $("#container-mask").fadeOut();
                active == false;
            }
        }, 1000);
    }, 1000);


    // PAUSA O GRÁFICO
    $scope.stopedChart = function() {

    }

    // CRIA O GRÁFICO
    $scope.createChart = function(data) {
        $scope.chart = {};
        // CONFIGURAÇÕES DO GRÁFICO
        $scope.chart.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d) {
                    return d.x;
                },
                y: function(d) {
                    return d.y;
                },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e) {
                        console.log("stateChange");
                    },
                    changeState: function(e) {
                        console.log("changeState");
                    },
                    tooltipShow: function(e) {
                        console.log("tooltipShow");
                    },
                    tooltipHide: function(e) {
                        console.log("tooltipHide");
                    }
                },
                xAxis: {
                    axisLabel: 'Tempo (s)'
                },
                yAxis: {
                    axisLabel: 'Corrente (a)',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart) {
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Consumo Atual',
                css: {
                    'color': 'white',
                    'font-size': '24px'
                }
            },
            subtitle: {
                enable: false,
                html: "",
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px',
                    'color': 'white'
                }
            },
            caption: {
                enable: false,
                html: '',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };
        console.log($scope.chart);

        // DADOS NO GRÁFICO
        $scope.chart.data = createChartData(data);

        function createChartData(data) {
            // LIMITA A QUANTIDADE DE DADOS
            var limit = 40;
            if (data != null) {
                data.splice(0, data.length - limit);
            } else {
                data = [{
                    x: 0,
                    y: 0
                }];
            }

            // ARRAY DE OBJETOS RETORNADO
            return [
                // LINHA PRINCIPAL
                {
                    values: data,
                    key: 'Hoje',
                    color: '#FFC814'
                }
            ];
        };
        setTimeout(function() {
            $("text").css({
                "fill": "white"
            });
            $("g.nv-y .nv-axislabel").attr("y", "-60")
        }, 1);
    };

});