/**
 * A kind of small progressive enhancement; the markup just contains the
 * two words, but here we smush them together and enclose the second
 * word in a span in order to be able to style it separately.
 */
$.fn.bhWordMark = function () {
  return this.each(function () {
    var $current = $(this);
    $current.html($current.html().replace(/()(hotel)/i, '<span>$2</span>'));
  });
}; /* $.fn.bhWordMark */
