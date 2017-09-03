class App {
  constructor() {
    this.firstFetch = true;
    this.roomnames = {};
    this.messages = {};
  }

  init () {
    $('.username').on('click', (user) => {
      this.handleUsernameClick(user.data);
    });

    $('#send .submit').on('click', (element) => {
      this.handleSubmit(element);
    });
    
    $('select').on('change', function(option) {
      let $messageBlocks = $('.messageBlock');
      for (let i = 0; i < $messageBlocks.length; i++) {        
        if ($($messageBlocks[i]).data('roomname') !== this.options[option.target.selectedIndex].text) {
          $($messageBlocks[i]).hide();
        } else {
          $($messageBlocks[i]).show();
        }
      }
    });
  }

  handleUsernameClick () {
    console.log(username);
  }
  
  handleSubmit () {
    let message = {
      username: window.location.search.split('=').pop(),
      text: $('#send input').val(),
      roomname: $('select option:selected').val()
    };

    $('#send input').val('');
    console.log($('#send input'));
    this.send(message);
  }

  send (message) {
    let context = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        context.fetch();
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch () {
    let dataString; 
    let time = new Date($('.timestamp').first().data('timestamp'));
    time.setSeconds(time.getSeconds() + 1);
    let context = this;

    // this.firstFetch ? dataString = 'order=-createdAt' : dataString = 'where={"createdAt":{"$gte":{"__type":"Date","iso":"' + time + '"}}}';

    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt',
      type: 'GET',
      data: dataString,
      contentType: 'application/json',
      success: (data) => {
        console.log('chatterbox: Fetch request completed');
        context.parseData(data);

      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });

  }

  parseData (data) {
    for (let message of data.results) {

      let cleanRoom = DOMPurify.sanitize(message.roomname);
      let cleanUsername = DOMPurify.sanitize(message.username);
      let cleanText = DOMPurify.sanitize(message.text);
      this.renderMessages(cleanRoom, cleanUsername, cleanText, message.createdAt, message.objectId);
      this.renderRoomNames(cleanRoom);
    }
    this.firstFetch = false;
  }

  renderMessages (roomname, username, text, timestamp, id) {
    if (this.messages[id]) {
      return;
    } else {
      this.messages[id] = true;
    }
    // if (roomname.length === 0 || text.length === 0) {
    //   return;
    // }

    let $messageBlock = $('<div class="messageBlock"></div>');
    let $messageHeader = $('<div class="messageHeader"><span class="username"></span><span class="divider"></span><span class="timestamp"></span></div>');
    let $messageText = $('<div class="messageText"></div>');

    $messageBlock.attr('data-roomname', roomname);
    $messageHeader.find('.username').text(username);
    $messageHeader.find('.username').attr('data-user', username);
    $messageHeader.find('.divider').text(' ');
    $messageHeader.find('.timestamp').attr('data-timestamp', timestamp);
    $messageHeader.find('.timestamp').text($.timeago(timestamp));
    $messageText.text(text);

    this.firstFetch ? $messageBlock.appendTo($('#chats')) : $messageBlock.prependTo($('#chats'));
    $messageHeader.appendTo($messageBlock);
    $messageText.insertAfter($messageHeader);
  }

  renderRoomNames (roomname) {
    let rooms = $('.roomname option');
    // console.log(rooms);
    if (this.roomnames[roomname]) {
      return;
    } else {
      this.roomnames[roomname] = true;
    }

    let $roomname = $('<option></option>');
    $roomname.attr('data-roomname', roomname);
    $roomname.text(roomname);

    $roomname.appendTo($('#roomSelect .roomname'));
  }


  clearMessages () {
    $('#chats').children().remove();
  }

}

let app = new App();

$(document).ready(function() {
  app.fetch();
  app.init();
  setInterval(() => {
    app.fetch();
  }, 1000);
});




