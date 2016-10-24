// CONTROLLER DE GASTOS
angular.module("watterizerApp", ["chart.js"]).controller("gastoCtrl", function ($scope, $http, $interval) {
	$http.get("/setor/")
	.then(function (response) {
		$scope.gastos = response.data;
		console.log($scope.gastos)
	});
	for (var i = 0; i <= $scope.gastos.length - 1; i++) {
    	$scope.graph.data.push($scope.gastos[i]);
      	$scope.graph.labels.push(i);
	}
    $scope.graph.series = ['Series A'];

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