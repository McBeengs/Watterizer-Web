function MainViewModel(data) {

  var self = this;
  var socket = io.connect('localhost:1515');
  var arrayGastoBanco=[];
  $(document).ready(function() {
    $.ajax({
      url: "/gasto/hoje/2",
      success: function(response) {
        for (var i = 0; i <= response.length - 2; i++) {
          arrayGastoBanco.push(response[i].substr(response[i].lastIndexOf("\'")+1));
          console.log(arrayGastoBanco[i]);
        };
      },
      error: function(xhr) {
//Do Something to handle error
}
});

    socket.emit("load",2);
    $('#mask').css({
      "background" : "rgba(66,66,66,0.4)"
    });
    $('#conexaoCaiu').css({
      "display" : "block"
    });
  })
  self.lineChartData = ko.observable({
    labels : ["January","February","March","April","May","June","July"],
    datasets : [
    {
      fillColor : "rgba(151,187,205,0.5)",
      strokeColor : "rgba(151,187,205,1)",
      pointColor : "rgba(151,187,205,1)",
      pointStrokeColor : "#fff",
      data : [0.1,1,0.9,0.2,0.7,0.5,0.4]
    }
    ]
  });
  socket.on('toClient', function (data) {
    if (data==null) {
      console.log('null');
      data=[]
    }
    if (data.arduino==2) {
      for (var i = 0; i <= data.array.length - 1; i++) {
        self.lineChartData().datasets[0].data.shift();
        self.lineChartData().datasets[0].data.push(data.array[i]);
      };
      $('#mask').css({
        "background" : "white"
      });
      $('#conexaoCaiu').css({
        "display" : "none"
      });
    }



    self.initLine();

  });
  socket.on('toClientLoad', function (data) {
    if (data==null) {
      console.log('null');
      data=[]
    } 
    for (var i = 0; i <= arrayGastoBanco.length - 1; i++) {
      self.lineChartData().datasets[0].data.shift();
      self.lineChartData().datasets[0].data.push(arrayGastoBanco[i]);

    };
    for (var i = 0; i <= data.length - 1; i++) {
      self.lineChartData().datasets[0].data.shift();
      self.lineChartData().datasets[0].data.push(data[i]);

    };

    self.initLine();

  });
  socket.on('noConnection', function () {
    $('#mask').css({
      "background" : "rgba(66,66,66,0.4)"
    });
    $('#conexaoCaiu').css({
      "display" : "block"
    });

  });
  self.initLine = function() {
    var options = {
      animation : false,
      scaleOverride : true,
scaleSteps : 10, // The number of steps in a hard coded scale
scaleStepWidth : 0.1, // The value jump in the hard coded scale
scaleStartValue : 0 // The scale starting value
};
var ctx = $("#canvas").get(0).getContext("2d");
var myLine = new Chart(ctx).Line( vm.lineChartData(), options );
}
}
var vm = new MainViewModel();
ko.applyBindings(vm);
vm.initLine();