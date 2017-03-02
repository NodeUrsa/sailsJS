



    var checkEquipmentHtml = "<div class='form-line center'>"+
        "<h2 class='offset0'>Enter your token:</h2>"+
        "<div class='input'>"+
        "<div data-name='otp-code-block' >"+
        "<input type='text' class='input-section' maxlength='2' tabindex='1' placeholder='XX'>"+
        "<input type='text' class='input-section' maxlength='2' tabindex='2' placeholder='XX'>"+
        "<input type='text' class='input-section' maxlength='2' tabindex='3' placeholder='XX'>"+
        "</div>"+
        "</div>"+
        "</div>"+
        "<div class='row center'>"+
        "<button class='large success'>Submit</button>"+
        "</div>";

    $('#checkEquipment').html(checkEquipmentHtml);

    $('.success').bind("click", sendToken);

    function sendToken (e) {
        var inputArr = $('.input input'),
            val1 = inputArr.eq(0).val(),
            val2 = inputArr.eq(1).val(),
            val3 = inputArr.eq(2).val();
        if (val1 && val2 && val3) token = val1 + val2 + val3;
        else {
            alert("There are empty fields");
            return;
        }

        $.ajax({
            type: "get",
            url: "/equipment/apply/" + token,
            success: function (respons) {
                console.log("success");
                console.log(respons);
                window.location.reload();

            },
            error: function (respons) {
//                console.log(JSON.parse(respons.responseText).error.text);
                var html = "<div class='form-line center'>"+
                    "<div class='input'>"+
                    "<h3 class='offset0'>"+ JSON.parse(respons.responseText).error.text +"</h3>"+
                    "</div>"+
                    "</div>"+
                    "<div class='row center'>"+
                    "<button class='large delete'>Retry</button>"+
                    "</div>";
                $('#checkEquipment').html(html);

                $('.delete').bind("click", function(){
                    window.location.reload();
                });
            }
        });
    }



    var n = 0;
    $('.input input').keyup(function(e){
        var target = $(e.target);
        var value = target.val();
        var keyCode = e.keyCode;
        if(keyCode = 8 && value == ""){
            if(n == 0) {n++}
            else {target.prev().val("").focus(); n = 0;}
        }
        if(value.length == 2) target.next().val("").focus();

    });




