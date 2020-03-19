function request_access(){
    window.location.href = '/chat';
};

function resultsboxcorrect(){
  var txt;
  if (confirm("You are correct! :)")){
    window.location.href='/';
  }
  else{
    txt="Thanks for playing!";
  }
  };

  function resultsboxincorrect(){
    var txt;
    if (confirm("Oh no :( You guessed wrong!")){
      window.location.href='/';
    }
    else{
      txt="Thanks for playing!";
    }
    };
