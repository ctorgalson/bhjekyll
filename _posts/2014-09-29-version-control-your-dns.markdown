---
layout: post
title:  "Version control your DNS (!)"
date:   2014-09-29 13:00:00
categories: Maintenance
tags: route53 git dns Cloudflare 
teaser: Manage DNS for small sites using git, Route 53, and cli53
---

## DNS can be hard to keep track of&hellip;

Managing DNS for small projects can be painful. Small projects often mean clients with small budgets who don't have the infrastructure to keep track of DNS information. This is especially true for projects that use one or more third-party services such as Google hosted apps (i.e. custom-domain Gmail), AWS/Cloudfront etc. Tracking these services down can mean a tedious discovery process at the outset of a project or maintenance contract where the registrar, host or anything related to DNS changes.

There are also few good ways to retain a usable *history* of the DNS configuration for a site or project. Since these settings are often managed through webhost or domain registrar control panels, the "best" option for recording the previous state of DNS configuration is sometimes a screenshot.

## &hellip;so centralize it

Amazon's AWS offerings are bewilderingly diverse and amazingly useful. One of their services, [Route 53][route53], is dedicated to managing DNS. It allows *all* DNS records for a project to be managed from a single location and has the additional advantages of being quite cheap, and of providing nameservers that are widely separated geographically.

What's even better, it allows DNS records to be imported and exported in a [standard (BIND) format][bindformat], raising the prospect that the DNS records for a site or project can be source-controlled. 

## &hellip;and then version-control it

The mere fact of textual import/export tools makes version control of DNS possible. But on their own, the import and export tools make for a rather cumbersome process:

### Method 1: it's better than screenshots

1. make changes in the Route53 interface;
2. export the changed DNS zone to a file;
3. overwrite a local file;
4. commit changes to version control system (git!) and push

Fortunately, there is a fantastic (and free) command-line tool, [cli53][cli53], for managing Route53 information. This tool, depending on your degree of familiarity with the BIND format, makes one of two workflows possible&mdash;both reasonably convenient.

### Method 2: if BIND is scary

Avoid working with BIND directly:

1. Using [the AWS Route 53
   console](https://console.aws.amazon.com/route53) or the [cli53
   command-line tool](https://github.com/barnybug/cli53), make changes
   to the DNS zone as required;
2. Using the same tool, (optionally) update the SOA serial number [as specified in RFC 1912
   2.2](http://www.zytrax.com/books/dns/apd/rfc1912.txt) (YYYYMMDDNN);
3. Re-export the zone file&mdash;overwiting the existing file&mdash;using cli53:
   `$ cli53 export example.com.txt >
   example.com.txt`;
4. Commit and push changes.

### Method 3: if BIND is *not* scary

Dive into BIND (though if you already know BIND, you probably don't need this post):

1. Make sure you understand [the bind file
   format](https://en.wikipedia.org/wiki/Zone_file);
2. Make changes to zone file directly; 
3. Import it to Route 53 using cli53:
   `$ cli53 import example.com --file example.com.txt`;
4. Commit and push changes.

## &hellip;and Cloudflare works too

It's just not quite as convenient. If you're a [Cloudflare][cloudflare] user&mdash;which means you'll be managing your DNS there&mdash;you can
also export your DNS settings, though there's no convenient tool that I
know of for interacting directly with the DNS zone files. So, if you're
willing to manually download and override your files (see **Method 1: it's better than screenshots**, above), you've got a reasonably convenient way to back up and manage your DNS zone files.

[bindformat]: https://en.wikipedia.org/wiki/Zone_file
[route53]:    https://aws.amazon.com/route53
[cli53]:      https://github.com/barnybug/cli53
[cloudflare]: https://www.cloudflare.com/
