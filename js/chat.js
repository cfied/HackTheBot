(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
           // $.post("/message", {text= $message_input.val()}) //attempt to post
            return $message_input.val();
        };
        sendMessage = function (text) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            //message_side = message_side === 'left' ? 'right' : 'left';
            message_side = 'right';
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            console.log(text);
            // fetching bot-response
            fetch('/message', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: text
              })
            }).then((response) => {
                console.log("received response");
                console.log(response);
             })
            .catch((error) => {
              console.error(error);
            });

            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        $('.send_message').click(function (e) {
            return sendMessage(getMessageText());
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage(getMessageText());
            }
        });
        //sendMessage('Hello Philip! :)');
        //setTimeout(function () {
          //  return sendMessage('Hi Sandy! How are you?');
        //}, 1000);
        //return setTimeout(function () {
          //  return sendMessage('I\'m fine, thank you!');
        //}, 2000);
    });
}.call(this));