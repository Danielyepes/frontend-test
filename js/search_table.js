$(document).ready(function() {
  $("#search").change(function() {
    var state = $("#search option:selected");

    var selected = [];
    $(state).each(function(index, city) {
      selected.push([$(this).val()]);
    });
    var regex = selected.join("|");
    console.log(regex);

    $("#example1")
      .DataTable()
      .column(0)
      .search(regex, true, true)
      .draw();
  });
});
