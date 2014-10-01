/**
 * Foundation-Pygments Plain Text plugin
 *
 * Pygments is great, but showing line numbers while enabling the
 * reader to copy the text is problematic (the table option is kind of
 * mediocre for styling reasons...) This jquery plugin works around this.
 *
 * Foundation tabs implmented using Zurbs accessibility strategy.
 *
 * @see http://foundation.zurb.com/docs/components/tabs.html
 * @todo Can't tab to inactive tab...
 */
$.fn.fpPlainText = function ($element, overrides) {
  "use strict";
  // Configurable options. These give developers options, but aside from the id
  // attributes they're quite specific to foundation. With any luck, they're
  // complete enough to allow this plugin to be used with other, similar
  // markup...
  var defaults = {
    pygmentsId: 'pygments-%%',
    plaintextId: 'plaintext-%%',
    tabsNav: '<dl class="tabs" data-tab role="tablist"/>',
    highlightTab: '<a role="tab" tabindex="0" aria-selected="true">Highlighted</a>',
    plaintextTab: '<a role="tab" tabindex="-1" aria-selected="false">Plain text</a>',
    highlightWrap: '<dd role="presentational" class="active"></div>',
    plaintextWrap: '<dd role="presentational"></div>',
    tabsContentWrap: '<div class="tabs-content"></div>'
  },
  // Merge configurable options with overrides:
  settings = $.extend({}, defaults, overrides);
  // Return for chaining:
  return this.each(function (i, e) {
    // Variables for this individual element:
    //
    // -- the current element
    // -- a clone of it
    // -- the current, unique pygments and plaintext id attribute values
    // -- the $tabsNav element ready to be inserted into the DOM
    var $current = $(this),
        $clone = $current.clone(),
        pygmentsId = settings.pygmentsId.replace(/%%/, i),
        plaintextId = settings.plaintextId.replace(/%%/, i),
        $tabsNav = $(settings.tabsNav);
    // Build the tabs nav first:
    $tabsNav
      // Build and append the highlight tab:
      .append(
        $(settings.highlightTab).attr({
          href: '#' + pygmentsId,
          controls: pygmentsId
        })
        .wrap(settings.highlightWrap)
        .parent()
      )
      // Likewise for the plaintext tab:
      .append(
        $(settings.plaintextTab).attr({
          href: '#' + plaintextId,
          controls: plaintextId
        })
        .wrap(settings.plaintextWrap)
        .parent()
      )
      .insertBefore($current);
    // Go to work on the current element; we need to add Foundation tabs
    // class, id, role and aria-hidden attributes:
    $current
      .addClass('content active')
      .attr({
        id: pygmentsId,
        role: 'tabpanel',
        'aria-hidden': false
      });
    // Similarly for the plaintext element, *but* at the end, we add the
    // $current collection to this collection and wrap the whole works using the
    // tabsContentWrap:
    $clone
      .addClass('content plain')
      .attr({
        id: plaintextId,
        role: 'tabpanel',
        'aria-hidden': true
      })
      .find('pre')
      .text(
        $clone
          .find('.lineno')
          .remove()
          .end()
          .text()
        )
      .end()
      .insertAfter($current)
      .add($current)
      .wrapAll(settings.tabsContentWrap);
  });
}; /* $fn.fpPlainText */
