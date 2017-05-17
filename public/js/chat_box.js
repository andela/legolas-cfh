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
