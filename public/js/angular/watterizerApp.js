// APP BASE
var app = angular.module('watterizerApp', []);
var config;
app.run(['$rootScope', '$http', function ($rootScope, $http) {
	$http.get("/sessao")
	.then(function (response){
		$rootScope.token = response.data[1];
		config = { headers: { 'token':$rootScope.token }}
		console.log($rootScope.token);
	});
}]);