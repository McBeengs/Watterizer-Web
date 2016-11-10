// CONTROLLER DE GASTOS
app.requires.push('nvd3');
app.controller("gastoCtrl", function ($rootScope, $scope, $http, $interval, $timeout) {
	$timeout(function() {
		var socket = io.connect($scope.ip+':1515');
		var active = false;
		$http.get("/setor/arduino")
		.then(function (response) {
			$scope.setores = response.data;
		});

		$scope.startChart = function () {
			$http.get("/dados/gasto/arduino/"+$scope.arduinoSel)
			.then(function (response) {
				$rootScope.gastos = [];
				for (var i = 0; i <= response.data.length - 2; i++) {
					$rootScope.gastos.push({x: i, y: Number(response.data[i].substr(response.data[i].lastIndexOf("\'")+1))});
				}
				$rootScope.i = i;
				$timeout(function () {
					$scope.getRecentData();
				}, 200);
				
			});	
		}

		$scope.getRecentData = function () {
			socket.emit("load",2);
			socket.on('toClientLoad', function (data) {
				if (data==null) {
					console.log('null');
					data=[];
				}
				for (j = 0; j <= data.length - 1; j++) {
					$scope.gastos.push({x: $rootScope.i, y: Number(data[j].substr(data[j].lastIndexOf("\'")+1))});
					$rootScope.i++;
				}
				$timeout(function() {
					$scope.createChart($scope.gastos);
				}, 500);
			});
		}

		socket.on('toClient', function (data) {
			if (data.arduino == arduinoSel) {
				$scope.gastos.push({x: $rootScope.i, y: data.gasto});
				active = true;
				$timeout(function() {
					$scope.createChart($scope.gastos);
				}, 1000);
				$rootScope.i++;
			}
		});

		$interval( function() {
			if(active == false){
				$("#mask-container").fadeIn();
			} else {
				$("#mask-container").fadeOut();
				active == false;
			}
		}, 1001);
    }, 100);

	$scope.stopedChart = function () {

	}

	$scope.createChart = function (data) {
		$scope.chart = {};
		$scope.chart.options = {
			chart: {
				type: 'lineChart',
				height: 450,
				margin : {
					top: 20,
					right: 20,
					bottom: 40,
					left: 55
				},
				x: function(d){ return d.x; },
				y: function(d){ return d.y; },
				useInteractiveGuideline: true,
				dispatch: {
					stateChange: function(e){ console.log("stateChange"); },
					changeState: function(e){ console.log("changeState"); },
					tooltipShow: function(e){ console.log("tooltipShow"); },
					tooltipHide: function(e){ console.log("tooltipHide"); }
				},
				xAxis: {
					axisLabel: 'Tempo (s)'
				},
				yAxis: {
					axisLabel: 'Corrente (a)',
					tickFormat: function(d){
						return d3.format('.02f')(d);
					},
					axisLabelDistance: -10
				},
				callback: function(chart){
					console.log("!!! lineChart callback !!!");
				}
			},
			title: {
				enable: true,
				text: 'Consumo Atual',
				css: {
					'color':'white',
					'font-size':'24px'
				}
			},
			subtitle: {
				enable: false,
				html: "<p>Gráfico de consumo de energia elétrica referente a:<p><br> <form class='form-inline'><div class='form-group'><label><b>Setor:</b></label><select ng-options='setor as setor.setor for setor in setores' ng-model='setorSel'><option  value=''>-- Selecione um Setor --</option></select></div><div class='form-group'><label><b>Arduíno:</b></label><select ng-options='arduino.id as arduino.id for arduino in setorSel.arduinos' ng-model='arduinoSel'><option  value=''>-- Selecione um Arduino --</option></select></div></form>",
				css: {
					'text-align': 'center',
					'margin': '10px 13px 0px 7px',
					'color':'white'
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
		$scope.chart.data = sinAndCos(data);
		/*Random Data Generator */
		function sinAndCos(data) {
			// var sin = [],sin2 = [],
			// cos = [];
			var limit = 40;
			if(data!=null){
				data.splice(0, data.length - limit);
			} else {
				data = [{x:0, y:0}];
			}
            // //Data is represented as an array of {x,y} pairs.
            // for (var i = 0; i < 41; i++) {
            // 	sin.push({x: i, y: Math.sin(i/10)});
            // 	sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
            // 	cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            // }

            //Line chart data should be sent as an array of series objects.
            return [
            {
                    values: data,      //values - represents the array of {x,y} data points
                    key: 'Hoje', //key  - the name of the series.
                    color: '#FFC814'  //color - optional: choose your own line color.
                }/*,
                {
                	values: cos,
                	key: 'Cosine Wave',
                	color: '#2ca02c'
                },
                {
                	values: ,
                	key: 'Projeção',
                	color: '#7777ff',
                    area: false      //area - set to true if you want this line to turn into a filled area chart.
                }*/
            ];
	    };
	};
});