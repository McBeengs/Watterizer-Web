// APP BASE
var app = angular.module('watterizerApp', [/*'datatables'*/"chart.js"]);
app.run(function ($http) {
	$http.get("/sessao")
	.then(function (response){
		$http.defaults.headers.common.token = response.data[1];
		console.log($("#name"))
		$("#name").html(response.data[0]);
	});
});