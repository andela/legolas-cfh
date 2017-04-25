const nodemailer = require('nodemailer');
// require('dotenv').config({ silent: true });


exports.sendInvite = (req, res) => {
  // console.log(req);
  const gameLink = req.body.url;
  const inviteeEmail = req.body.invitee;
  const sender = req.body.gameOwner;
  const link = `${gameLink}&email=${email}`;
  let transporter = nodemailer.createTransport(transport({
    service: 'gmail',
    auth: {
        user: 'andelalegolas@gmail.com',
        pass: 'andelalegolas1'
    }
  }));

  const mailOptions = {
    from: '"Andela Legolas 👻" <andelalegolas@gmail.com>',
    to: inviteeEmail,
    subject: 'Invitation to join Game',
    html: `<h3> Cards for Humanity </h3><br/>
    You have been invited by <a>${sender}</a> to join a game in cards for humanity<br/>
    click on this link <a href="${link}">here</a> to join the game now.<br/>
    <strong>Cards For Humanity</strong>`
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
};