/**
 * A kind of small progressive enhancement; the markup just contains the
 * two words, but here we smush them together and enclose the second
 * word in a span in order to be able to style it separately.
 */
var $wordMarks = $('.title-area h1, footer h1');
$wordMarks.html($wordMarks.html().replace(/( )(hotel)/i, '<span>$2</span>'));


/**
 * Pygments is great, but showing line numbers while enabling the
 * reader to copy the text is problematic (the table option is kind of
 * mediocre for styling reasons...) This jquery works around this.
 */
$('.highlight').each(function(i,e) {
  // To get going, we need id strings for the tab content panes (keyed to the
  // iterator), the current code block, a cloned code block, and the  navigation
  // tabs element:
  var pygmentsId = 'pygments-' + i,
      plainId = 'plain-' + i,
      $current = $(this),
      $clone = $current.clone();
      $tabsNav = $('<dl class="tabs" data-tab/>'),
  // Build and inset the nav:
  $tabsNav.insertBefore($current).html('<dd class="active"><a href="#' + pygmentsId + '">Highlighted</a></dd><dd><a href="#' + plainId + '">Plain text</a></dd>');
  // Add the content and active classes and a new id attribute to the
  // syntax-highlighted code:
  $current.addClass('content active').attr({id: pygmentsId});
  // Add one more class and remove the active class from the clone, find
  // the code block, remove the line numbers and wrapping markup, then
  // insert after the highlighted code. Finally, add the $current to the
  // collection and wrap the whole works as foundation expects it:
  $clone.addClass('content plain').removeClass('active').attr({id: plainId}).find('pre').text($clone.find('.lineno').remove().end().text()).end().insertAfter($current).add($current).wrapAll('<div class="tabs-content"/>');
  });

