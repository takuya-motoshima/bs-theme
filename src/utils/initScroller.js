import perfectScrollbar from 'perfect-scrollbar';

// Initialize scroller
export default function(element) {
  if (!element[0]) return;
  return new perfectScrollbar(element[0], { wheelPropagation: false });
}
