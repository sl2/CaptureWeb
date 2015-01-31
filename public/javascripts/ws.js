$(function(){
    var socket = io.connect("http://localhost:3000");

    $("#url_button").click(function(){ 
        var url = $('#url_input').val();
        var vw = $('#viewW').val();
        var vh = $('#viewH').val();
        var cw = $('#clipW').val();
        var ch = $('#clipH').val();
        $.jGrowl("Now capturing... : " + url);
        socket.emit('sv_capture_web', { 
            url:url, 
            setting:{vw:vh,vh:vh,cw:cw,ch:ch}
        });
    });
     
    socket.on('cl_display_web_dom', function(data){
        console.log(data);
        $('#web_dom').html(data.dom.innerHTML);
    });

    socket.on('cl_display_web_image', function(data){
        $('#web_image').attr('src', 'data:image/png;base64,' + data.image);
    });

});



