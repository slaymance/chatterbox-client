
let app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  messages: null,
    
  init: function() {
    $('.username').on('click', function(user) {
      app.handleUsernameClick(user.data);
    });
    $('#send .submit').on('click', function(element) {
      app.handleSubmit(element);
    });
    // console.log(`options: ${$('option')}`);
    $('select').on('change', function(option) {
      // console.log(`this: ${this}`);
      let $messageBlocks = $('.messageBlock');
      // console.log(`$messageBlocks: ${$messageBlocks}`);
      for (let i = 0; i < $messageBlocks.length; i++) {
        // console.log(`$messageBlocks[i]: ${$messageBlocks[i]}`);
        
        if ($($messageBlocks[i]).data('roomname') !== this.options[option.target.selectedIndex].text) {
          $($messageBlocks[i]).hide();
        } else {
          $($messageBlocks[i]).show();
        }
      }

    });


    app.fetch();
    // console.log('message:' + data);
    // renderMessage(message);
  },

  send: function(message) {
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
  },
  
  fetch: function() {
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.getMessage(data);
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }

    });
  },

  fetchNewMessage: function() {
    var time = $('.timestamp').first().data('timestamp');
    console.log(time);

    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: 'where={"createdAt":{"$gte":{"__type":"Date","iso":"' + time + '"}}}',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.getMessage(data);
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  
  clearMessages: function() {
    $('#chats').children().remove();
  },
  
  renderMessage: function(message) {
    cleanUsername = DOMPurify.sanitize(message.username);
    cleanText = DOMPurify.sanitize(message.text);
    cleanRoomname = DOMPurify.sanitize(message.roomname);

    if (cleanUsername.length === 0 || cleanText.length === 0) {
      return;
    }

    let $messageBlock = $('<div class="messageBlock" style="display: none";></div>');
    let $messageHeader = $('<div class="messageHeader"><span class="username"></span><span class="divider"></span><span class="timestamp"></span></div>');
    let $messageText = $('<div class="messageText"></div>');

    $messageBlock.attr('data-roomname', cleanRoomname);
    $messageHeader.find('.username').text(cleanUsername);
    $messageHeader.find('.username').attr('data-user', cleanUsername);
    $messageHeader.find('.divider').text(' ');
    $messageHeader.find('.timestamp').attr('data-timestamp', message.createdAt);
    $messageHeader.find('.timestamp').text($.timeago(message.createdAt));
    $messageText.text(cleanText);

    $messageBlock.appendTo($('#chats'));
    $messageHeader.appendTo($messageBlock);
    $messageText.insertAfter($messageHeader);
  },
  
  renderRoom: function(message) {
    cleanRoom = DOMPurify.sanitize(message.roomname);

    var rooms = $('.roomname option');

    for (var i = 0; i < rooms.length; i++) {
      if ($(rooms[i]).data('roomname') === cleanRoom || cleanRoom.replace(' ').length === 0) {
        return;
      }
    }

    $roomname = $('<option></option>');
    $roomname.attr('data-roomname', cleanRoom);
    $roomname.text(cleanRoom);

    $roomname.appendTo($('#roomSelect .roomname'));
    // $('#roomSelect :first-child').text(cleanRoom);
  },
  
  handleUsernameClick: function(username) {
    console.log(username);
  },
  
  handleSubmit: function(submit) {
    var message = {
      username: window.location.search.split('=').pop(),
      text: $('#send input').val(),
      roomname: $('select option:selected').val()
    };
    this.send(message);
    
  },

  getMessage: function(data) {
    for (let i = 0; i < data.results.length; i++) {
      app.renderMessage(data.results[i]);
      app.renderRoom(data.results[i]);
    }
    app.showMessage(data);
  },

  showMessage: function(data) {
    let cleanRoom = DOMPurify.sanitize(data.roomname);
    let $messageBlocks = $('.messageBlock');
    for (let i = 0; i < $messageBlocks.length; i++) {
      if ($($messageBlocks[i]).data('roomname') === $('select option:selected').val()) {
        $($messageBlocks[i]).show(500);
      } else {
        $($messageBlocks[i]).hide(500);
      }
    }
    // $('.messageBlock').show(500);
  }

};

$(document).ready(function() {
  app.init();
  setInterval(function() {
    app.fetchNewMessage();
    
  }, 1000);
});




