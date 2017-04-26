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

  it('should have a h1 element @h1', () => {
    assert.isAtLeast(window.$('h1').length, 1, 'Make sure to create an `h1` element.');
  });

  it('should have content in the h1 element @h1', () => {
    assert.equal(window.$('h1').text(), 'Donate Now', 'Make sure to set the content of your `h1` element to "Donate Now".');
  });

  it('should have at least 6 buttons @.btn', () => {
    assert.isAtLeast(window.$('.btn').length(), 6, 'Make sure you have up to 6 buttons on the page.');
  });

  it('should have a ul element for the menu @ul', () => {
    assert.isAtLeast(window.$('ul').length, 1, 'Make sure to create a `ul` element for the menu.');
  });

  it('should have at least 10 li elements as menu items @li', () => {
    assert.isAtLeast(window.$('li').length, 10, 'Make sure to create at least 10 `li` elements as menu items.');
  });

  it('should have content for all `li` elements. @li', () => {
    const message = 'Every menu item must have text';
    assert.notEqual(window.$('li:first').text(), '', message);
    assert.notEqual(window.$('li:last').text(), '', message);
  });
});
