function request_access(){
    console.log("Button clicked");
    fetch('/chat', {
      method: 'GET',
      headers: {
        Accept: 'text/html',
        'Content-Type': 'text/html',
      },
    });
}
