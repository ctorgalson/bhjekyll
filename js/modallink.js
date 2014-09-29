/**
 * Contact form modal link--makes any link to contact form a link to a modal
 * in the page *if* there's javascript (not much sense doing this otherwise...)
 *
 * Does not attempt to rewrite links if this *is* the contact page.
 *
 * @todo Don't even include the contact form in the template--lazy-load it once
 *       the rest of the page has downloaded.
 */
var pathname = '/contact.html';
if (window.location.pathname !== pathname) {
  $('a[href="' + pathname + '"').attr({'data-reveal-id': 'contact-modal'});
}
