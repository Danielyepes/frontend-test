//function delete elements equals, this function works with filter for delete elements repeat
var count = true;
var info = [];
//it is going to request for ajax
$.ajax({
  url: "https://api.cebroker.com/v1/cerenewaltransactions/GetLogsRecordData?startdate=08/03/2017&enddate=08/03/2017",
  type: "GET",
  cache: true,
  dataType: "html",
  success: function (data) {
    var res =
    '<table id="example1" class="table table-bordered table-striped" data-page-length="20"><thead><tr><th>State Code</th><th>Pro Code</th><th>Profession</th>   <th>License ID</th><th>Cycle End Date</th><th>Compliance Status</th><th>Client ID</th><th>Start Log Date</th><th>End Log Date</th><th>Environment</th><th>Machine</th></tr></thead><tbody>';
    
    var informacion = JSON.parse(data);
    
    info = informacion;
    for (var i in informacion) {

      res += "<tr role='row'>";
      res +=
        "<td>" +
        informacion[i].cd_cebroker_state +
        "</td>" +
        "<td>" +
        informacion[i].pro_cde +
        "</td>";
      if (informacion[i].cd_profession != "") {
        res += "<td>" + informacion[i].cd_profession + "</td>";
      } else {
        res += "<td>" + "-" + "</td>";
      }
      res +=
        "<td>" +
        informacion[i].id_license +
        "</td>" +
        "<td>" +
        informacion[i].dt_end +
        "</td>";
      if (informacion[i].ds_compl_status_returned != "NOT_FOUND") {
        res += "<td>" + informacion[i].ds_compl_status_returned + "</td>";
      } else {
        res += "<td>" + "-" + "</td>";
      }
      res +=
        "<td>" +
        informacion[i].id_client_nbr +
        "</td>" +
        "<td>" +
        informacion[i].dt_Start_Log +
        "</td>" +
        "<td>" +
        informacion[i].dt_end_log +
        "</td>" +
        "<td>" +
        informacion[i].cd_environment +
        "</td>" +
        "<td>" +
        informacion[i].cd_machine +
        "</td>" +
        "</tr>";
    }
    res +=
      "</tbody><tfoot><tr><th>State Code</th><th>Pro Code</th><th>Profession</th><th>License ID</th><th>Cycle End Date</th><th>Compliance Status</th><th>Client ID</th><th>Start Log Date</th><th>End Log Date</th><th>Environment</th><th>Machine</th></tr></tfoot></table> ";

    charge_conf(res);
    preloader(res);
  }
});

//count how many times appear one element
function countInArray(array, what) {
  var count = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i].cd_machine === what) {
      count++;
    }
  }
  return count;
}

//count how many times appear one element
function countInArrayc(array, what) {
  var count = 0;
  for (var j = 0; j < array.length; j++) {
    if (array[j].ds_compl_status_returned === what) {
      count++;
    }
  }
  return count;
}

function charge_conf(data) {
  if (sessionStorage.getItem("data_table") != null) {
    count = false;
  }
  if (count) {
    sessionStorage.setItem("data_table", data);
  }
  //add table to html
  $("#table").html(sessionStorage.getItem("data_table"));

  //begin the table config
  $("#example1").DataTable({
    paging: true,
    select: false,
    lengthChange: false,
    searching: true,
    order: [
      [7, "desc"]
    ],
    info: true,
    autoWidth: true
  });

  //date start , end and diference
  var date_start, date_end, diff = 0,
    temp;

  var line_data = [];
  var line_labels = [];

  // end - start returns difference in milliseconds

  for (var y in info) {
    date_start = new Date(info[y].dt_Start_Log);
    date_end = new Date(info[y].dt_end_log);
    temp = (date_end.getTime() - date_start.getTime()) / 1000; //time positive in miliseconds
    if (!isNaN(temp))
      diff += temp;

    line_data.push(diff);
  }
  line_labels.push("Day " + date_start.getDate());

  var average = (diff / info.length);
  $(".inner h3").text(average + " Seconds");

  $(function () {
    //-------------
    //- LINE CHART -
    //--------------
    var Data = {
      labels: line_labels.slice(0, 20), //show twenty five elements
      datasets: [{
        label: "Average Response Time per Day",
        fillColor: "rgba(210, 214, 222, 1)",
        strokeColor: "rgba(210, 214, 222, 1)",
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: line_data.slice(0, 20) //show twenty five elements
      }]
    };
    //options de chart
    var ChartOptions = {
      //Boolean - If we should show the scale at all
      showScale: true, //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: false, //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)", //Number - Width of the grid lines
      scaleGridLineWidth: 1, //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true, //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true, //Boolean - Whether the line is curved between points
      bezierCurve: true, //Number - Tension of the bezier curve between points
      bezierCurveTension: 0.3, //Boolean - Whether to show a dot for each point
      pointDot: false, //Number - Radius of each point dot in pixels
      pointDotRadius: 4, //Number - Pixel width of point dot stroke
      pointDotStrokeWidth: 1, //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius: 20, //Boolean - Whether to show a stroke for datasets
      datasetStroke: true, //Number - Pixel width of dataset stroke
      datasetStrokeWidth: 2, //Boolean - Whether to fill the dataset with a color
      datasetFill: true, //String - A legend template
      maintainAspectRatio: true, //Boolean - whether to make the chart responsive to window resizing
      responsive: true
    };

    //Line Chart declaration and obtain get 2d context the canvas of html
    var lineChartCanvas = $("#lineChart").get(0).getContext("2d");
    var lineChart = new Chart(lineChartCanvas); //inicializate line chart graph in canvas
    var lineChartOptions = ChartOptions;
    lineChartOptions.datasetFill = false;
    lineChart.Line(Data, lineChartOptions);

    //create arrays 
    var aux_info = []; //array aux for save all machine record
    var array_labels_machine = [];
    var array_value_machine = [];
    for (var i in info) {
      aux_info.push(info[i].cd_machine);
    }
    //filter our array
    array_labels_machine = aux_info.filter(function (x, i, a) {
      return a.indexOf(x) == i;
    });


    for (var x in array_labels_machine) {
      array_value_machine.push(countInArray(info, array_labels_machine[x]));
    }

    //-------------
    //- BAR CHART -
    //-------------
    //Bar Chart declaration and obtain get 2d context the canvas of html    
    var barChartCanvas = $('#barChart').get(0).getContext('2d')
    var barChart = new Chart(barChartCanvas);

    var Bar_data = {
      labels: array_labels_machine.sort(),
      datasets: [{
        label: "Total Requests per Machine",
        fillColor: "rgba(210, 214, 222, 1)",
        strokeColor: "rgba(210, 214, 222, 1)",
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: array_value_machine.sort()
      }]
    };
    var barChartData = Bar_data;
    var barChartOptions = { //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero: true, //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: true, //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)", //Number - Width of the grid lines
      scaleGridLineWidth: 1, //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true, //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true, //Boolean - If there is a stroke on each bar
      barShowStroke: true, //Number - Pixel width of the bar stroke
      barStrokeWidth: 2, //Number - Spacing between each of the X value sets
      barValueSpacing: 5, //Number - Spacing between data sets within X values
      barDatasetSpacing: 1, //Boolean - whether to make the chart responsive
      responsive: true,
      maintainAspectRatio: true
    };

    barChartOptions.datasetFill = false;
    barChart.Bar(barChartData, barChartOptions);

    //create arrays 
    var aux_info1 = []; //array aux for save all machine record
    var array_labels_compilance = [];
    var array_value_compilance = [];
    for (var i in info) {
      aux_info1.push(info[i].ds_compl_status_returned);
    }
    //filter our array
    array_labels_compilance = aux_info1.filter(function (x, i, a) {
      return a.indexOf(x) == i;
    });

    for (var x in array_labels_compilance) {
      array_value_compilance.push(countInArrayc(info, array_labels_compilance[x]));
    }

    //-------------
    //- BAR CHART -
    //-------------
    //Bar Chart declaration and obtain get 2d context the canvas of html    
    var barChartCanvas_c = $('#barChart_c').get(0).getContext('2d')
    var barChart = new Chart(barChartCanvas_c);

    var Bar_data_c = {
      labels: array_labels_compilance.sort(),
      datasets: [{
        label: "Total Requests per Compliance Status ",
        fillColor: "rgba(210, 214, 222, 1)",
        strokeColor: "rgba(210, 214, 222, 1)",
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: array_value_compilance.sort()
      }]
    };
    var barChartData_c = Bar_data_c;

    barChartOptions.datasetFill = false;
    barChart.Bar(barChartData_c, barChartOptions);
  });
}