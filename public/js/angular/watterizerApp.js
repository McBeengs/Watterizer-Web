// APP BASE
var app = angular.module('watterizerApp', []);
app.run(function ($rootScope,$http) {
	$http.get("/sessao")
	.then(function (response){
		$rootScope.usuarioLogado=response;
		$http.defaults.headers.common.token = response.data[1];
		$("#name").html(response.data[0]);
	});
});