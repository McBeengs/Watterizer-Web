// CONTROLLER DE COMPUTADORES
app.controller('pcCtrl', function($scope, $timeout, $http) {
    var intervalo = setInterval(function() {
        $scope.pcsLigadosFull = []
        if ($scope.load) {
            $http.get("/dados/equipamento")
                .then(function(response) {
                    $scope.equipamentos = response.data;
                    $http.get("/pcligado")
                        .then(function(response) {
                            $scope.pcsligados = response.data;
                            for (var i = $scope.equipamentos.length - 1; i >= 0; i--) {
                                for (var j = $scope.pcsligados.length - 1; j >= 0; j--) {
                                    console.log($scope.pcsligados[j]);
                                    if ($scope.equipamentos[i].mac == $scope.pcsligados[j]) {
                                        $scope.pcsLigadosFull.push($scope.equipamentos[i])
                                    }
                                };

                            };
                            console.log($scope.pcsLigadosFull);
                        }, function(response) {
                            console.log("Falhou")
                        });
                }, function(response) {
                    console.log("Falhou")
                });
            clearInterval(intervalo);
        };
    }, 200);
    var pcligado = {};


    $scope.desliga = function(mac) {
        for (var i = $scope.pcsLigadosFull.length - 1; i >= 0; i--) {
            if ($scope.pcsLigadosFull[i].mac == mac) {
                pcligado.mac = mac
                $http.post("/desligapc", pcligado)
                    .then(function(response) {}, function(response) {
                        console.log("Falhou")
                    });
            }
        };
    }
    $timeout(function() {
        var socket = io.connect($scope.ip + ':1515');
        socket.on("pcLigado", function(data) {
            $timeout(function() {
                for (var i = $scope.equipamentos.length - 1; i >= 0; i--) {
                    if ($scope.equipamentos[i].mac == data) {

                        $scope.pcsLigadosFull.push($scope.equipamentos[i])

                    }
                };
            }, 1000);
        })
        socket.on("pcDesligado", function(data) {
            $timeout(function() {
                for (var i = $scope.pcsLigadosFull.length - 1; i >= 0; i--) {
                    if ($scope.pcsLigadosFull[i].mac == data) {
                        $scope.pcsLigadosFull.splice(i, 1);
                    }
                };
            }, 1000);
        })
        socket.on("continuaUsando", function(data) {
            $timeout(function() {
                for (var i = $scope.pcsLigadosFull.length - 1; i >= 0; i--) {
                    if ($scope.pcsLigadosFull[i].mac != data) {
                        $("#resposta").html("Computador está sendo utilizado")
                        $("#resposta").fadeIn();
                    }
                };
            }, 1000);
        })
    }, 1000);
});