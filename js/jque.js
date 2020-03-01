function request_access(){
  x= Math.random();
  if(x<0.5){
    window.location.href = '/chat';
  }
  else{
    window.location.href = '/chat';
  }
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
  
