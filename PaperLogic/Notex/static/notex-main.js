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
        background = $(this).attr("background")
        $(this).css({
            "opacity": "1",
            "background-color": background
        })
    });
    reset_notes_states()
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
        raw_note.content = $("#input_new_note").val().replace(/(?:\r\n|\r|\n)/g, '<br>').trim();
        if(!raw_note.content){
            notice("You have to write something.");
            reset_notes_states()
            return;
        }
        create_note(raw_note);

        $("#input_new_note").val("");
        reset_notes_states()
    });
    
    //Click on create note text area
    $("#input_new_note").on("click", function () {
        $(this).css("height","300")
        $(".create_note_actions_container").show()
        if ($(".instruction-cover")){$(".instruction-cover").fadeOut(500)}
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
                "opacity": "1",
                "position": "absolute"
            })
            note.find("div p").attr("contenteditable", "false")
        });
        
        //Input new note text area
        $(".create_note_actions_container").hide()
        $("#input_new_note").css("height","40px")
        $("#input_new_note").parent().css("z-index","0");
        
        //Color picker style
        $(".colorPicker").each(function () {
            //If not set style yet
            if ($(this).parent().find(".colorPicker-picker").length==0){
                $(this).colorPicker({showHexField: false, colors: ["ff5e5e", "ffd15e","79ff5e","60ffd4","5e9bff","975bff","f45bff","ff5b9d","96ffe8","ffda96", "efa492","a7a0f7"]});
            }        
        });
        //Change its background
        $(".colorPicker-picker").each(function () {
            $(this).css("background-image", "url("+color_picker_background+")");
        });
        //Format notes
        format_notes()
        add_notes_listener()
        add_color_picker_listener()
        //Hide blanket
        $("#blanket").hide()
        //Rearrange
        $grid.masonry()
    }

    function format_notes(){
        //Trim long notes
        $(".note").each(function(){
            content = $(this).find(".note-content").html()

            content = content.trim()
            content = content.replace(/&lt;br&gt;/g,"<br/>")
            content = content.replace(/&lt;div&gt;/g,"<br/>")
            content = content.replace(/&lt;\/div&gt;/g,"")
            content = content.replace(/&nbsp;/g,"")
            content = content.replace(/(?:\r\n|\r|\n)/g, '<br>')
            content = content.replace(/:br:/g, '<br>')

            
            $(this).find(".note-content").html(content)
            })
    }

    function add_color_picker_listener(){
        $(".note_action.colorPicker").unbind()
        $(".note_action.colorPicker").change(function() {
            $(this).parent().parent().parent().css("background-color",$(this).val())
            update_note($(this).parent().parent().parent())
        });
        $( ".create_menu.colorPicker" ).change(function() {
            $(this).parent().parent().parent().find("#input_new_note").css({"background-color":$(this).val()})
        });
    }

    function update_note(note) {
        data = {};
        data.csrfmiddlewaretoken = CsrfToken();
        data.id = note.attr("note-id");
        html = note.find(".note-content").html()
        console.log(html)
        note.find(".note-content").html(html.replace(/<div>/g,":br:"))
        note.find(".note-content").html(note.find(".note-content").html().replace(/<br>/g,":br:"))
        console.log(note.find(".note-content").text())
        data.content = note.find(".note-content").text();
        note.find(".note-content").html(html)
        data.background = note.find(".note-menu .colorPicker").val()
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
        data.background = $("#input_new_note").parent().find(".create_note_actions_container .create_note_actions #create_note_color").val()
        data.date = (new Date()).toISOString().replace("T", " ");
        note_date = data.date
        note_background = data.background

        loading(true);
        $.ajax({
            dataType: "text",
            method: "POST",
            url: "/api/createnote",
            data: data
        }).done(function (data) {
            loading(false);
            new_note = '<div class="note" style="background-color: '+note_background+'" note-id="'+data+'"><div><p class="note-content">'+raw_note.content+'</p> </div> <div class="note-date"> <span><h6><small>'+note_date+'</small></h6></span> </div> <div class="note-menu"> <span class="btn note_action save">Save</span> <span class="btn note_action delete">Delete</span> <span> <input readonly placeholder = "Color" class="btn note_action color colorPicker" type="text" name="color1" value="#333399"/> </span> </div> </div>'
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
            note = $(this).parent();
            $(this).attr("contenteditable", "true")
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
        $("#messages").show().fadeOut(3000)

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