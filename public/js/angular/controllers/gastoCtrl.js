// CONTROLLER DE GASTOS
app.requires.push('chart.js');
app.controller("gastoCtrl", function ($rootScope, $scope, $http, $interval) {
	setTimeout(function() {
		var socket = io.connect('localhost:1515');
		$http.get("/dados/gasto/hoje")
		.then(function (response) {
			$scope.prepareChart = {};
	    	$scope.prepareChart.series = ['Hoje'];
	    	$scope.prepareChart.data = [];
	    	$scope.prepareChart.labels = [];
			$scope.gastos = response.data;
			var j = 0;
			for (var i = $scope.gastos.length - 41; i <= $scope.gastos.length - 1; i++) {
		    	$scope.prepareChart.data.push($scope.gastos[i].substr($scope.gastos[i].lastIndexOf("\'")+1));
		    	// if(i % 5 == 0){
		      		$scope.prepareChart.labels.push(j);
		      	// } else {
		      		// $scope.prepareChart.labels.push(" ");
		      	// }
		      	j++;
			}
	      	j++;

			socket.emit("load",2);
			socket.on('toClientLoad', function (data) {
				data=["1':'1","2':'2","3':'3","4':'4","5':'5","6':'2","7':'3","8':'4","9':'1","10':'2","11':'3","12':'4"];
				if (data==null) {
					console.log('null');
					data=[]
				}
				for (var i = 0; i <= data.length - 1; i++) {
		    		$scope.prepareChart.data.push(data[i].substr(data[i].lastIndexOf("\'")+1));
		    		// if(i % 5 == 0){
		      			$scope.prepareChart.labels.push(j);
		      		// } else {
		      			// $scope.prepareChart.labels.push(" ");
		      		// }
	    			j++;
				}
				$scope.prepareChart.data.splice(0, $scope.prepareChart.data.length - 41);
				$scope.prepareChart.labels.splice(0, $scope.prepareChart.labels.length - 41);
				console.log($scope.prepareChart.labels)
			});
			$scope.chart = {};
	    	$scope.chart.series = $scope.prepareChart.series;
	    	$scope.chart.labels = $scope.prepareChart.labels;
	    	$scope.chart.data = [];
	    	$scope.chart.data.push($scope.prepareChart.data);
	    	console.log($scope.chart.data);
	    	setInterval(function () {
	    		$scope.chart.data[0].push("2")
	    		$scope.chart.labels.push(j)
	    		$scope.chart.data[0].shift();
	    		$scope.chart.labels.shift();
	    		document.getElementById('line').style.display = 'none';
				document.getElementById('line').style.display = 'block';
	    		j++;
	    	}, 1000);
		});
	}, 100);

    // $scope.update = function() {
    //   var random = (Math.floor((Math.random() * 10) + 1));
    //   $scope.graph.data.push(random);
    //   $scope.graph.labels.push($scope.i++);
    // }
    // $interval($scope.update, 2000);
	// $scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September"];
	// $scope.series = ['Series A', 'Series B'];
	// $scope.data = [
	// 	[65, 59, 80, 81, 56, 55, 40],
	// 	[28, 48, 40, 19, 86, 27, 90]
	// ];
	// $scope.onClick = function (points, evt) {
	// 	console.log(points, evt);
	// };
	// $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
	// $scope.options = {
	// 	scales: {
	// 		yAxes: [
	// 			{
	// 				id: 'y-axis-1',
	// 				type: 'linear',
	// 				display: true,
	// 				position: 'left'
	// 			},
	// 			{
	// 				id: 'y-axis-2',
	// 				type: 'linear',
	// 				display: true,
	// 				position: 'right'
	// 			}
	// 		]
	// 	}
	// };
});