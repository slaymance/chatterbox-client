class App {
  constructor() {
    this.firstFetch = true;




  }

  fetch () {
    let dataString; 
    var time = $('.timestamp').first().data('timestamp');

    this.firstFetch ? dataString = 'order=-createdAt' : `where={"createdAt":{"$gte":{"__type":"Date","iso":"${time}"}}}`;

    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: dataString,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        this.parseData(data);
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });

  }

  parseData (data) {
    for (let message of data) {
      let cleanRoom = DOMPurify.sanitize(message.roomname);
      let cleanUsername = DOMPurify.sanitize(message.username);
      let cleanText = DOMPurify.sanitize(message.text);
      this.renderMessages(cleanRoom, cleanUsername, cleanText, message.createAt);
      this.renderRoomNames(cleanRoom, cleanUsername, cleanText);
    }
    this.firstFetch = false;
  }

  renderMessages (roomname, username, text, timestamp) {
    if (roomname.length === 0 || text.length === 0) {
      return;
    }

    let $messageBlock = $('<div class="messageBlock" style="display: none";></div>');
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

    for (let room of rooms) {
      if ($(room).data('roomname') === roomname || roomname.replace(' ').length === 0) {
        return;
      }
    }

    $roomname = $('<option></option>');
    $roomname.attr('data-roomname', roomname);
    $roomname.text(roomname);

    $roomname.appendTo($('#roomSelect .roomname'));
  }


}





