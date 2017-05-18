// Show or hide ChatBox
$('body').on('click', '#endChat', () => {
  $('#endChat').hide();
  $('#startChat').show();
  $('.chat-content').slideUp();
});
$('body').on('click', '#startChat, .emojionearea-editor', () => {
  $('#startChat').hide();
  $('#endChat').show();
  $('.chat-content').slideDown();
});
$('body').on('click', '.chatbox', () => $('#chatNotification').hide());
//MONGOHQ_URL=mongodb://heroku_wl7x6cjf:buqkcc7m11iuiivaofl6nfm3ti@ds159670.mlab.com:59670/heroku_wl7x6cjf