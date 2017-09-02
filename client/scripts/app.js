
let app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  messages: null,
    
  init: function() {
    $('.username').on('click', function(user) {
      app.handleUsernameClick(user.data);
    });
    $('#send .submit').unbind('submit').bind('submit', function(element) {
      app.handleSubmit(element);
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
      data: message,
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
      data: 'where={"createdAt":{"$gte":{"__type":"Date","iso":"2017-09-01T00:36:50.246Z"}}}',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.messages = data;
        // console.log(data.results);
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
    // console.log(message);
    cleanUsername = DOMPurify.sanitize(message.username);
    cleanText = DOMPurify.sanitize(message.text);

    $('#chats').prepend('<span></span>');

    let $element = $('#chats :first-child');
    $element.addClass('username');
    $element.data(cleanUsername); 
    $element.text(`${cleanUsername}: ${cleanText}`);
  },
  
  renderRoom: function(message) {
    cleanRoom = DOMPurify.sanitize(message.roomname);

    $('#roomSelect').append('<span></span>');
    $('#roomSelect :first-child').text(cleanRoom);
  },
  
  handleUsernameClick: function(username) {
    console.log(username);
  },
  
  handleSubmit: function(submit) {
    console.log(submit);
  },

  getMessage: function(data) {
    for (let i = 0; i < data.results.length; i++) {
      app.renderMessage(data.results[i]);
    }
  }

};

$(document).ready(function() {
  app.init();  
});




