//Create a chat module to use.

(function () {

  window.Chat = {

    socket : null,
    username:null,

  

    initialize : function(socketURL,name) {

      $.mobile.loading( "show", {

            text: "connecting...",

            textVisible: true,

            textonly: false,

            theme: "b",

            html: ""

      });

      this.socket = io.connect(socketURL);
      this.username=name;

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

       this.socket.emit('login', {

        name:  this.username,

        msg: "【"+ $('#name').val()+"进入了聊天室！】"

      });

    },



    //Adds a new message to the chat.

    add : function(data) {

      var name = data.name || '游客';

      var msg = $('<li class="msg" class="ui-li-static ui-body-inherit ui-last-child"></li>')

        .append('<span class="name">' + name + '</span>: ')

        .append('<span class="text">' + data.msg + '</span>');

      

      $('#mbox').append('<li class="ui-li-static ui-body-inherit ui-last-child"><h3>'+name+':</h3><p>'+data.msg+'</p></li>').listview('refresh');


       var div = document.getElementById('scrolldIV');

      div.scrollTop = div.scrollHeight;

      

    },



    login : function(data) {



       $.mobile.loading( "hide" );
       
       for(var i=0;i<data.length;i++){
        //  alert(data[i].msg);
         var name = data[i].name || '游客';

        $('#mbox').append('<li class="ui-li-static ui-body-inherit ui-last-child"><h3>'+name+':</h3><p>'+data[i].msg+'</p></li>').listview('refresh');

           
           
       }

       var div = document.getElementById('scrolldIV');

      div.scrollTop = div.scrollHeight;

      

    },

 

    //Sends a message to the server,

    //then clears it from the textarea

    send : function() {

      this.socket.emit('msg', {

        name: this.username,

        msg: $('#message').val()

      });



      $('#message').val('');



      return false;

    }

  };

}());