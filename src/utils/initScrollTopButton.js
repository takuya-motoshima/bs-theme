import $ from 'jquery';

export default function() {
  const offset = 220;
  const duration = 500;
  const button = $('<div class="bt-scroll-top"></div>');
  button.appendTo('body');
  $(window).on('scroll', event => {
    if ($(event.currentTarget).scrollTop() > offset) button.fadeIn(duration);
    else button.fadeOut(duration);
  });
  button.on('touchstart mouseup', event => {
    $('html, body').animate({ scrollTop: 0 }, duration);
    event.preventDefault();
  });
}
