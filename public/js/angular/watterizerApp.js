// APP BASE
var app = angular.module('watterizerApp', [/*'datatables'*/]);
var config;
app.run(function ($http) {
	$http.get("/sessao")
	.then(function (response){
		$http.defaults.headers.common.token = response.data[1];
	});
});