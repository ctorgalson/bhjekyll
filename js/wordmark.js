/**
 * A kind of small progressive enhancement; the markup just contains the
 * two words, but here we smush them together and enclose the second
 * word in a span in order to be able to style it separately.
 */
var $wordMarks = $('.title-area h1, footer h1');
$wordMarks.html($wordMarks.html().replace(/( )(hotel)/i, '<span>$2</span>'));
