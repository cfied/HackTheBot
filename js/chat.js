var socket = io();
socket.on('connect', () => {
  socket.emit('request room number');
});

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
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text, message_side) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        $('.send_message').click(function (e) {
          try{
            e.preventDefault();
            socket.emit('chat message', getMessageText);
          }catch(error){
            console.log(error);
          }
          return sendMessage(getMessageText(),'right');
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
              try{
                e.preventDefault();
                socket.emit('chat message', getMessageText());
              }catch(error){
                console.log(error);
              }
              return sendMessage(getMessageText(),'right');
            }
        });
        socket.on('chat message', function(msg){
            sendMessage(msg,'left');
            window.scrollTo(0, document.body.scrollHeight);
        });
    });
}.call(this));

socket.on('decision',function(decision){
    if (confirm(decision)){
      socket.emit('leave');
      window.location.href='/';
    }
})

function resultsbox(guess){
  socket.emit('check mode', guess);
  socket.on('mode bool', function(bool){
    if(Number(bool) == 1){
      if (confirm("You are correct! :)")){
        socket.emit('leave');
        window.location.href='/';
      }
    }else{
      if (confirm("Oh no :( You guessed wrong!")){
        socket.emit('leave');
        window.location.href='/';
      }
    }
  })
}
