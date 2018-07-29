logoX=""
$(function () {
    if (show_register_form) {
        $("#registerform").delay(400).slideDown(600);
    } else {
        $("#loginform").delay(400).slideDown(600);
    }
    
    //Form listeners: note content, save btn, delete btn
    add_notes_listener()

    //Rotate logo
    logoX = anime({
        targets: '#logoX',
        rotate: '1turn',
        loop:true,
        duration:1000,
        easing: 'linear'
    });
    logoX.pause()

    //Arrage notes
    $grid = $('.grid').masonry({
        itemSelector: '.note',
        fitWidth: false,
        percentPosition: true,
        columnWidth: 100
    });

    //Generate random color for each note
    $(".note").each(function () {
        $(this).css({
            "background-color": "rgba(" +
                Math.floor((Math.random() * 150) + 100) + "," +
                Math.floor((Math.random() * 150) + 100) + "," +
                Math.floor((Math.random() * 150) + 100) + ")",
            "opacity": "0.7"
        })
    });

    //Listerners
    $(".grid").resize(function(){
        notice("Look like you have no note now.")
    })

    $("#input_new_note").on("focus", function (e) {
        $("#blanket").show();
        $(this).parent().css({ "z-index": "2", "position": "fixed" });
    });

    //When click on blanket
    $("#blanket").on("click", function (e) {
        blanket = $(this);
        blanket.css("display", "none");
        reset_notes_states();
    });

    //Click on Create note button
    $("#create_note").on("click", function () {
        raw_note={}
        raw_note.content = $(this).parent().find("textarea").val()
        if(!raw_note.content){
            notice("You have to write something.");
            reset_notes_states()
            return;
        }
        create_note(raw_note);
        $(this).parent().find("textarea").val("");
        reset_notes_states()
    });
    
    //Click on create note text area
    $("#input_new_note").on("click", function () {
        $(this).css("height","300")
        $("#create_note").show()
    });
    //Forms on login screen
    $("#register_btn").on("click", function () {
        $("#loginform").slideUp(300).delay(300);
        $("#registerform").delay(500).slideDown(300);
    });

    $("#back_btn").on("click", function () {
        $("#registerform").slideUp(300).delay(300);
        $("#loginform").delay(500).slideDown(300);
    });

    function reset_notes_states() {

        //Send to back, make tranparent
        $(".note").each(function () {
            note = $(this);
            note.find("div span.save").hide();
            note.find("div span.delete").show();
            note.find("div span.color").show();
            note.css({
                "z-index": 0,
                "opacity": "0.7",
                "position": "absolute"
            })
            note.find("div p").attr("contenteditable", "false")
        });

        //Input new note text area
        $("#create_note").hide()
        $("#input_new_note").css("height","40px")
        $("#input_new_note").parent().css("z-index","0");

        add_notes_listener()

        //Hide blanket
        $("#blanket").hide()
        //Rearrange
        $grid.masonry()
    }

    function update_note(note) {
        data = {};
        data.csrfmiddlewaretoken = CsrfToken();
        data.id = note.attr("note-id");
        data.content = note.find("div p").text();
        data.date = (new Date()).toISOString().replace("T", " ");
        loading(true);
        $.ajax({
            dataType: "text",
            method: "POST",
            url: "/api/updatenote",
            data: data
        }).done(function (data) {
            loading(false);
            notice("Note updated.")
        }).fail(function () {
            notice("An error happened.")
            loading(false);
        });
    }

    function delete_note(note) {
        data = {};
        data.csrfmiddlewaretoken = CsrfToken();
        data.id = note.attr("note-id");

        loading(true);
        $.ajax({
            dataType: "text",
            method: "POST",
            url: "/api/deletenote",
            data: data
        }).done(function (data) {
            loading(false)
            notice("Note deleted.");
            }).fail(function () {
                notice("An error happened.")
                loading(false);
            });
        note.hide();
        reset_notes_states();
    }

    function create_note(raw_note) {
        data = {};
        data.csrfmiddlewaretoken = CsrfToken();
        data.content = raw_note.content;
        data.date = (new Date()).toISOString().replace("T", " ");
        note_date = data.date

        loading(true);
        $.ajax({
            dataType: "text",
            method: "POST",
            url: "/api/createnote",
            data: data
        }).done(function (data) {
            loading(false);
            new_note = '<div class="note" note-id="'+data+'"><div><p class="note-content">'+raw_note.content+'</p> </div> <div class="note-date"> <span><h6><small>'+note_date+'</small></h6></span> </div> <div class="note-menu"> <span class="btn note_action save">Save</span> <span class="btn note_action delete">Delete</span> <span class="btn note_action color">Color</span> </div> </div>'
            elem = $.parseHTML(new_note)

            $grid.masonry().prepend(elem).masonry( 'appended', elem ).masonry();
            reset_notes_states()
            notice("Note created.")
        }).fail(function (data) {
            loading(false);
            notice("An error happened.")
        });
    }

    function loading(isLoading){
        if (isLoading) {
            $("#blanket").show();
            logoX.play()
        }
        else {
            $("#blanket").hide();
            logoX.pause();
            logoX.reset();
        }
    }
   
    //Hide/Show menu button
    is_menu_show = false
    $("#menu-btn").on("click", function (e) {
        if (is_menu_show){
            is_menu_show=false;
            $("#menu-container").slideUp()
        }
        else {
            is_menu_show=true
            $("#menu-container").slideDown()

        }
    });

    function add_notes_listener(){
    //When click on note's content
    $(".note-content").unbind()
        $(".note-content").on("click", function (e) {
            note = $(this).parent().parent();
            note.find("div p").attr("contenteditable", "true")
            note.css({ "z-index": "2", "position": "fixed" });
            note.animate({
                top: "20%",
                left: "30%"
            });
            note.css("opacity", "1");
            $("#blanket").css("display", "block");
            note.find("div span.save").show();
            note.find("div span.delete").hide();
            note.find("div span.color").hide();
            this.focus();
        });

        //Click on update note button
        $(".save").unbind()
            $(".save").on("click", function () {
                reset_notes_states();
                update_note($(this).parent().parent());
            });

    //Click on delete note button
    $(".delete").unbind()
        $(".delete").on("click", function () {
            reset_notes_states();
            delete_note($(this).parent().parent());
        });

    }

    function notice(message){
        $("#messages").hide()
        $("#messages").html(message)
        $("#messages").show().fadeOut(3000);
    }

    CsrfToken = function () {
        // Extract CSRF token from cookies
        var cookies = document.cookie.split(';'),
            csrf_token = null;
        $.each(cookies, function (index, cookie) {
            var cookieParts = $.trim(cookie).split('=');
            if (cookieParts[0] === 'csrftoken') {
                csrf_token = cookieParts[1];
            }
        });
        return csrf_token;
    };
});