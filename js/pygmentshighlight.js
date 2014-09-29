/**
 * Pygments is great, but showing line numbers while enabling the
 * reader to copy the text is problematic (the table option is kind of
 * mediocre for styling reasons...) This jquery works around this.
 *
 * Foundation tabs implmented using Zurbs accessibility strategy.
 *
 * @see http://foundation.zurb.com/docs/components/tabs.html
 * @todo Can't tab to inactive tab...
 */
$('.highlight').each(function(i,e) {
  // To get going, we need id strings for the tab content panes (keyed to the
  // iterator), the current code block, a cloned code block, and the  navigation
  // tabs element:
  var pygmentsId = 'pygments-' + i,
      plainId = 'plain-' + i,
      $current = $(this),
      $clone = $current.clone();
      $tabsNav = $('<dl class="tabs" data-tab role="tablist"/>'),
      highlightTab = '<dd role="presentational" class="active"><a href="#' + pygmentsId + '" controls="' + pygmentsId + '" role="tab" tabindex="0" aria-selected="true">Highlighted</a></dd>',
      plainTab = '<dd role="presentational"><a href="#' + plainId + '" controls="' + plainId + '" role="tab" tabindex="-1" aria-selected="false">Plain text</a></dd>',
  // Build and inset the nav:
  $tabsNav.insertBefore($current).html(highlightTab + plainTab);
  // Add the content and active classes and a new id attribute to the
  // syntax-highlighted code:
  $current.addClass('content active').attr({id: pygmentsId, role: 'tabpanel', 'aria-hidden': false});
  // Add one more class and remove the active class from the clone, find
  // the code block, remove the line numbers and wrapping markup, then
  // insert after the highlighted code. Finally, add the $current to the
  // collection and wrap the whole works as foundation expects it:
  $clone.addClass('content plain').removeClass('active').attr({id: plainId, role: 'tabpanel', 'aria-hidden': true}).find('pre').text($clone.find('.lineno').remove().end().text()).end().insertAfter($current).add($current).wrapAll('<div class="tabs-content"/>');
  });
