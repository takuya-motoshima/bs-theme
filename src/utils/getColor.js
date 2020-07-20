import $ from 'jquery';

// Get the template css colors into js vars
export default function(colorName) {
  const tmp = $('<div>', { class: colorName }).appendTo('body');
  const color = tmp.css('background-color');
  tmp.remove();
  return color;
}

