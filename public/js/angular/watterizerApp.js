// APP BASE
var app = angular.module('watterizerApp', []);
app.run(function ($scope, $http) {
	$http.get("/sessao")
	.then(function (response){
		$scope.token = response.data[1];
	});
	console.log($scope.token);
});