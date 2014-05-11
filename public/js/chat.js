//Create a chat module to use.

(function () {
  var userid=null;
  var username=null;
  window.Chat = {
    socket : null,
    initialize : function(socketURL,name) {

      $.mobile.loading( "show", {

            text: "connecting...",

            textVisible: true,

            textonly: true,

            theme: "b",

            html: "<center><img src='run.gif'></img><p>努力加载中......</p></center>"

      });
      $("#message").textinput('disable');
      //$("#send").button('disable');
      this.socket = io.connect(socketURL);
      userid=name;

      //Send message on button click or enter

      $('#send').click(function() {

        Chat.send();

      });



      $('#message').keyup(function(evt) {

        if ((evt.keyCode || evt.which) == 13) {

          Chat.send();

          return false;

        }

      });



      //Process any incoming messages

      this.socket.on('new', this.add);

      this.socket.on('in', this.login);

      this.socket.on('isRegistedR', this.isRegisted);

      this.socket.emit('isRegisted', {

        uid:  userid

      });

     

    },



    //Adds a new message to the chat.

    add : function(data) {

      var name = data.name || '游客';

      var msg = $('<li class="msg" class="ui-li-static ui-body-inherit ui-last-child"></li>')

        .append('<span class="name">' + name + '</span>: ')

        .append('<span class="text">' + data.msg + '</span>');

      

      $('#mbox').append('<li class="ui-li-static ui-body-inherit ui-last-child" ><h3>'+name+':</h3><p style="white-space: normal;">'+data.msg+'</p></li>').listview('refresh');


       var div = document.getElementById('scrolldIV');

      div.scrollTop = div.scrollHeight;

      

    },



    login : function(data) {

      //alert("!login");
       
       for(var i=0;i<data.length;i++){
        //  alert(data[i].msg);
         var name = data[i].name || '游客';

        $('#mbox').append('<li class="ui-li-static ui-body-inherit ui-last-child"><h3>'+name+':</h3><p  style="white-space: normal;">'+data[i].msg+'</p></li>').listview('refresh');

           
           
       }

       var div = document.getElementById('scrolldIV');

      div.scrollTop = div.scrollHeight;

      

    },

 

    //Sends a message to the server,

    //then clears it from the textarea

    send : function() {

      if($('#message').val()!="")
      {
      this.socket.emit('msg', {

        name: username,

        msg: $('#message').val()

      });



      $('#message').val('');
      }

      return false;

    },
    isRegisted : function(data) {
      //alert(data.isRegist);
       $.mobile.loading( "hide" );
       $("#message").textinput('enable');
       //alert(data.isRegist);
      if(data.isRegist=='yes'){
       
       username=data.username;
       this.emit('login', {
        name:   username,
        msg: "【"+  username+"进入了聊天室！】"
      });

     }else{

       $("#popupDialog").popup("open");
     }

      return false;

    },
 
    Regist : function(name,uid) {
      //alert(data.isRegist);
       //$.mobile.loading( "hide" );
       //alert(data.isRegist);
      userid=uid;
      username=name;
      this.socket.emit('Regist', {
        name:  name,
        uid: uid
      });
      this.socket.emit('login', {
        name:   username,
        msg: "【"+  username+"进入了聊天室！】"
      });

      return false;

    },
  };

}());