$(function() {
    if (show_register_form) {
        $("#registerform").delay(400).slideDown(600);
    } else{
        $("#loginform").delay(400).slideDown(600);
    }
    
    $grid = $('.grid').masonry({
        // options
        itemSelector: '.note',
        fitWidth: false,
        percentPosition: true
    });
    
    $(".note").each(function () {
        $(this).css({
            "background-color": "rgba(" +
                Math.floor((Math.random() * 255)) + "," +
                Math.floor((Math.random() * 255)) + "," +
                Math.floor((Math.random() * 255)) + ",0.5)"
        })
    });

    $("#register_btn").on("click", function () {
        $("#loginform").slideUp(300).delay(300);
        $("#registerform").delay(500).slideDown(300);
    });

    $("#back_btn").on("click", function () {
        $("#registerform").slideUp(300).delay(300);
        $("#loginform").delay(500).slideDown(300);
    });
  });