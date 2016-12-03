// CONTROLLER DA HOME
app.requires.push('nvd3');
app.controller('homeCtrl', function($rootScope, $scope, $window, $http, $interval, $timeout) {
    // LISTA TODOS OS SETORES
    var socket;
    var intervalo = setInterval(function() {
    	
    	var active = false;
    	if ($scope.load) {
    		$timeout(function() {
    			socket = io.connect($scope.ip + ':1515');
    			$http.get("/setor/arduino")
    			.then(function(response) {
    				$scope.setores = response.data;
    			});

    			$scope.startChart = function() {
    				$http.get("/dados/gasto/hoje/")
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
    						$scope.createChart($rootScope.gastos);
    					}, 500);
    				});
    			}

    			$scope.startChart();

    			socket.on('toClient', function(data) {
                    // if (data.arduino == $scope.arduinoSel) {
                    	$scope.gastos.push({
                    		x: $rootScope.i,
                    		y: data.gasto
                    	});
                    	active = true;
                    	$timeout(function() {
                    		$scope.createChart($scope.gastos);
                    	}, 1000);
                    	$rootScope.i++;
                    // }
                });
    			socket.on("pcCount", function(data) {
    				$timeout(function() {
    					$scope.pcsLigadosCount = data.length;
    				}, 1000);
    			})

    			$interval(function() {
    				if (active == false) {
    					$("text.nvd3.nv-noData").remove();
    				} else {
    					active == false;
    				}
    			}, 1000);
    		}, 100);
$http.get("/pcligado")
.then(function(response) {
	$scope.pcsLigadosCount = response.data.length;
}, function(response) {});
$http.get("/dados/contador")
.then(function(response) {
	if (response.data[0] != undefined) {
		$scope.dados = response.data[0];
	} else {
		$window.location.reload();
	}
}, function(response) {});
clearInterval(intervalo);
}
}, 0);



$scope.stopedChart = function() {

}

$scope.createChart = function(data) {
	$scope.generalChart = {};
	$scope.generalChart.options = {
		chart: {
			type: 'lineChart',
			height: 220,
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
				axisLabel: ''
			},
			yAxis: {
				axisLabel: '',
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
			enable: false,
			text: 'Consumo Atual',
			css: {
				'color': 'white',
				'font-size': '24px'
			}
		},
		subtitle: {
			enable: false,
			html: "<p>Gráfico de consumo de energia elétrica referente a:<p><br> <form class='form-inline'><div class='form-group'><label><b>Setor:</b></label><select ng-options='setor as setor.setor for setor in setores' ng-model='setorSel'><option  value=''>-- Selecione um Setor --</option></select></div><div class='form-group'><label><b>Arduíno:</b></label><select ng-options='arduino.id as arduino.id for arduino in setorSel.arduinos' ng-model='arduinoSel'><option  value=''>-- Selecione um Arduino --</option></select></div></form>",
			css: {
				'text-align': 'center',
				'margin': '10px 13px 0px 7px',
				'color': 'white'
			}
		},
		caption: {
			enable: false,
			html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
			css: {
				'text-align': 'justify',
				'margin': '10px 13px 0px 7px'
			}
		}
	};
	$scope.generalChart.data = createChartData(data);
	console.log($scope.generalChart)

	function createChartData(data) {
		var limit = 20;
		if (data != null) {
			data.splice(0, data.length - limit);
		} else {
			data = [{
				x: 0,
				y: 0
			}];
		}
		return [{
                values: data, //values - represents the array of {x,y} data points
                key: 'Hoje', //key  - the name of the series.
                color: '#FFC814' //color - optional: choose your own line color.
            }];
        };
    };
});