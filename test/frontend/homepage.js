const jsdom = require('jsdom');
const fs = require('fs');
const assert = require('chai').assert;

const file = fs.readFileSync('public/views/index.html').toString();

describe('Our HTML Page', () => {
  let window;
  before((next) => {
    jsdom.env(file, ['http://code.jquery.com/jquery.min.js'],
      (err, w) => {
        if (err) {
          next(err);
        }
        window = w;
        next();
      }
    );
  });

  it('should have a h1 element @h1', () => {
    assert.isAtLeast(window.$('h1').length, 1, 'Make sure to create an `h1` element.');
  });

  it('should have content in the h1 element @h1', () => {
    assert.equal(window.$('h1').text(), 'Donate Now', 'Make sure to set the content of your `h1` element to "Donate Now".');
  });

  it('should lead to sign up link the sign up / sign in @a', () => {
    assert.equal(window.$('#sign-up-test').attr('href'), '#!/signup', 'Ensure this links to the sign up page');
  });

  it('should lead to the gaming screen @a', () => {
    assert.equal(window.$('#game-test-link').attr('href'), '/play', 'Ensure this links to the game');
  });

  it('should have video content on donation @iframe', () => {
    assert.equal(window.$('iframe').attr('src'), 'https://www.youtube.com/embed/IaC25klxZyg', 'Ensure a video on charity is included in the charity section.');
  });

  it('should send the user to the right link  @#payment-link', () => {
    assert.equal(window.$('#payment-link').attr('href'), 'https://www.crowdrise.com/donate/project/cfhio/cards4humanity/?widget=true', 'Make sure the "Donate Now" button links to the right url.');
  });

  it('should have at least 6 buttons @btn', () => {
    assert.isAbove(window.$('.btn').length, 5, 'Make sure you more than 5 buttons on the page.');
  });

  it('should have a ul element for the menu @ul', () => {
    assert.isAtLeast(window.$('ul').length, 1, 'Make sure to create a `ul` element for the menu.');
  });

  it('should have at least 10 li elements as menu items @li', () => {
    assert.isAbove(window.$('li').length, 8, 'Make sure to create more than 8 `li` elements as menu items.');
  });

  it('Footer section should have footer element @footer', () => {
    assert.isAtLeast(window.$('footer').length, 1, 'Make sure to create an `footer` element.');
  });

  it('should have content for all `li` elements. @li', () => {
    const message = 'Every menu item must have text';
    assert.notEqual(window.$('li:first').text(), '', message);
    assert.notEqual(window.$('li:last').text(), '', message);
  });
});
