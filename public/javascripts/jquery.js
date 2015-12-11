/* Only works for elements in layout.jade */

var main = function() {
  $(".menu").click(function() {
    // remove classes from all
    $(".menu").removeClass("active");
    // add class to the one we clicked
    $(this).addClass("active");
  });
}

$(document).ready(main);
