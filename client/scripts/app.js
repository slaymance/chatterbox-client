class App {
  constructor() {
    this.firstFetch = true;

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
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch () {
    let dataString; 
    let time = $('.timestamp').first().data('timestamp');
    let context = this;
    console.log(this);

    this.firstFetch ? dataString = 'order=-createdAt' : `where={"createdAt":{"$gte":{"__type":"Date","iso":"${time}"}}}`;

    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
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
      this.renderMessages(cleanRoom, cleanUsername, cleanText, message.createdAt);
      this.renderRoomNames(cleanRoom, cleanUsername, cleanText);
    }
    this.firstFetch = false;
  }

  renderMessages (roomname, username, text, timestamp) {
    if (roomname.length === 0 || text.length === 0) {
      return;
    }

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

    if (rooms.length > 0) {
      for (let i = 0; i < rooms.length; i++) {
        if ($(rooms[i]).data('roomname') === roomname || roomname.replace(' ').length === 0) {
          return;
        }
      }
    }

    let $roomname = $('<option></option>');
    $roomname.attr('data-roomname', roomname);
    $roomname.text(roomname);

    $roomname.appendTo($('#roomSelect .roomname'));
  }



}

let app = new App();

$(document).ready(function() {
  app.fetch();
  app.init();
});




