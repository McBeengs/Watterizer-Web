// CONTROLLER DE GASTOS
app.requires.push('nvd3');
app.controller("gastoCtrl", function ($rootScope, $scope, $http, $interval, $timeout) {
	$timeout(function() {
		var socket = io.connect('localhost:1515');
		$http.get("/dados/gasto/hoje")
		.then(function (response) {
			for (var j = 0; j <= response.data.length - 1; j++) {
				$rootScope.gastos.push({x: j, y: Number(response.data[j].substr(response.data[j].lastIndexOf("\'")+1))});
			}
			$rootScope.gastos = response.data;
			socket.emit("load",2);
			socket.on('toClientLoad', function (data) {
				data=["1':'1","2':'2","3':'3","4':'4","5':'5","6':'2","7':'3","8':'4","9':'1","10':'2","11':'3","12':'4"];
				if (data==null) {
					console.log('null');
					data=[];
				}
				for (var i = 0; i <= data.length - 1; i++) {
		    		$scope.prepareChart.data.push(Number(data[i].substr(data[i].lastIndexOf("\'")+1)));
		    		// if(i % 5 == 0){
		      			$scope.prepareChart.labels.push(j);
		      		// } else {
		      			// $scope.prepareChart.labels.push(" ");
		      		// }
	    			j++;
				}
				$scope.prepareChart.data.splice(0, $scope.prepareChart.data.length - limit);
				$scope.prepareChart.labels.splice(0, $scope.prepareChart.labels.length - limit);
			});
		}, 100);
		$scope.createChart = function () {
			$scope.chart = {};
			$scope.options = {
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
					enable: true,
					html: 'Gráfico de consumo de energia elétrica referente a: <br> <b>Arduino:</b> <b>Dia:</b> ',
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
			$scope.data = sinAndCos();

			/*Random Data Generator */
			function sinAndCos() {
				var sin = [],sin2 = [],
				cos = [];
				var real = [];
				var projection = [];
				real.splice(0, real.length - 40);
				projection.splice(0, projection.length - 40);
	            //Data is represented as an array of {x,y} pairs.
	            for (var i = 0; i < 41; i++) {
	            	sin.push({x: i, y: Math.sin(i/10)});
	            	sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
	            	cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
	            }

	            //Line chart data should be sent as an array of series objects.
	            return [
	            	{
	                    values: real,      //values - represents the array of {x,y} data points
	                    key: 'Hoje', //key  - the name of the series.
	                    color: '#FFC814'  //color - optional: choose your own line color.
	                },
	                /*{
	                	values: cos,
	                	key: 'Cosine Wave',
	                	color: '#2ca02c'
	                },*/
	                {
	                	values: projection,
	                	key: 'Projeção',
	                	color: '#7777ff',
	                    area: false      //area - set to true if you want this line to turn into a filled area chart.
	                }
	            ];
            };
        };
    }, 100);
});