function request_access($this){
    console.log("button clicked");
    var request_data = $this.id;
    console.log("data: " + request_data)
    $.post( "request_access",{ request_data: request_data},function(json) {
         $("#request-access").hide();
         console.log("requested access complete");
    })
}