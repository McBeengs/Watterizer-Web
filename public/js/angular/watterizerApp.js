// APP BASE
var app = angular.module('watterizerApp', []);
app.run(function($rootScope, $http) {
    $rootScope.load = false;
    $http.get("/sessao")
        .then(function(response) {
            $rootScope.usuarioLogado = response;
            $http.defaults.headers.common.token = response.data[1];
            $("#name").html(response.data[0]);
            $rootScope.load = true
        });
    $http.get("/ip")
        .then(function(response) {
            $rootScope.ip = response.data
        });
});