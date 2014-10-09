---
layout: post
title: "Drupal 7 on Openshift (part 1)"
date: 2014-10-02 10:00:00
categories: deployment
tags: Openshift deployment git maintenance devops
teaser: "Experimenting with rapid deployment on Redhat's Openshift PAAS"
published: true
---

## There's something in  the air

There's a growing profusion of tools available for rapid Drupal
deployment and to simplify testing and new development. These tools
typically offer tight integration between version control and
deployment, sometimes even automatically creating whole new environments
when new git branches are created. There are hosted
services such as

* [Platform][platform]
* [Acquia Cloud][acquiacloud]
* [Pantheon][getpantheon]

And there are also developer tools, such as [drush-deploy][drushdeploy] and
Lullabot's [Github Pull Request Builder for Drupal][pullrequestbuilder]
(these were the subject of two [excellent][drushdeploysession] [sessions][pullrequestbuilder] at Drupalcon
Amsterdam 2014).

Even outside of the Drupal-specific toolset, there are other
possibilities. [Heroku][heroku] recently [expanded their php
support][herokuphp] making it a potentially attractive platform for
Drupal sites. [Redhat][redhat] also offers a <abbr title="Platform as a
Service">PAAS</abbr> that they call [Openshift][openshift].

## Openshift

Openshift already has a [Drupal Quickstart package][drupalquickstart], but it's
not really suitable for production use. It replaces `settings.php`,
`robots.txt`, `.htaccess`, and `drushrc.php` on every build, and it's also
got no ability to use `drush make` when building Drupal (so you can't
easily use anything but the default install profiles).

Nonetheless, I was intrigued by a fully open-source platform ([Openshift
Origin][openshiftorigin]) that's
reasonably priced, scalable, builds on `git push`, has Jenkins
integration available, and can get a Drupal site up and running in a
minute or two. I was also interested in being able to use the same
platform for non-Drupal sites, so I decided to rewrite Openshift's
Drupal Quickstart.

## Openshift-D7

For now, I'm concentrating on Drupal 7&mdash;though I can now
[officially][drupal8beta] give Drupal 8 a try. I'd note that this is
definitely an experimental product and is a) not guaranteed to work, and
b) may give your bicycle flat tires.

Disclaimers out of the way, [please clone the repository from Github and try it out][openshiftd7].

### Get started

First of all, you need to [create an Openshift account][openshift], and to [install the rhc
command line tools][rhccommandline]. After that, it's three steps (note,
you can replace 'DRUPAL7TEST' with whatever you like):

{% highlight console linenos %}
git clone https://github.com/ctorgalson/openshift-d7.git
cd openshift d7
rhc app create DRUPAL7TEST php-5.3 mysql-5.1 cron --from-code=https://github.com/ctorgalson/openshift-d7 -e ./.openshift/environment_variables
{% endhighlight %}

### Set up git branches

Openshift will now have set up a new git repo for your app. You need to
push any changes to this repo in order to get Openshift to rebuild and
redeploy the site. To make this easier, add the Openshift git repo as a
new remote. To do this, run `rhc app app show -a DRUPAL7TEST` and copy
the `Git URL` output.

Then, run `git remote add openshift` plus the copied url. With this
basic method, it's also possible to have e.g. one or more different
environments, like dev, production and staging, each tied to a different
branch in git.

To do that, you'd need to set up three local branches in
git, `dev`, `staging`, and `production`, and create three different
Openshift apps using the steps under *Get started*, above.

### Maintenance (this is the worst part&hellip;)

One quirk about Openshift is that you can't manually push/pull or commit
changes on the remote site. This is good in a way&mdash;it encourages
developers not to make changes on production etc&mdash;but since there's
no running environment with a git repo, we can't just use `drush dl` to
add new modules.

The original Openshift quickstart downloads Drupal + contrib on every
build, and I haven't altered that in this project, though I have added
the ability to use nonstandard install profiles and make files.

This means that we can *download* new modules by just adding them to a
make file, and it also means that we could use `drush up modulename` or
`drush updb` to update new modules, but I wasn't happy with forcing a
database-related drush action on every build (since, i.e. many build
operations might involve code-only changes etc).

So instead, I've implemented a system that uses a textfile,
`module_delta` that looks something like this:

{% highlight bash linenos %}
# This file should be relatively short, as the deploy action hook loops through
# it. If it contains one or more lines BEGINNING WITH 'update_modules:',
# 'enable_modules:', 'disable_modules:', or 'uninstall_modules:' followed by a
# space-delimited series of module names, the deploy action hook will run one or
# more of drush up, en, dis, or pm-uninstall as appropriate.
#
# At this time, the lines MUST occur in the order shown in the example below.
#
# Example (uncomment these lines to run drush up, en, dis, or pm-uninstall on
# deploy):
#
# update_modules: devel-7.x-1.x
# enable_modules: comment
# disable_modules: views_bulk_operations
# uninstall_modules: views_bulk_operations
{% endhighlight %}

The deploy hook script detects uncommented lines in this file beginning
with `update_modules`, `enable_modules`, `disable_modules`, and
`uninstall_modules`, and uses the appropriate drush command to perform
the operation.

#### Disadvantages

**This method works**. That said, it's not a *fantastic* workflow. As I
see it, there are the following disadvantages:

1. it's necessary to update both the make file and the `module_delta` file
2. to uninstall a module involves putting the module in the
   `disable_modules` line, running the build, and then moving the module
   to the `uninstall_modules` line, and running the build again

[platform]:             https://platform.sh/
[acquiacloud]:          https://www.acquia.com/products-services/acquia-cloud/
[getpantheon]:          https://www.getpantheon.com/
[drushdeploy]:          https://github.com/xforty/drush-deploy/
[drushdeploysession]:   https://amsterdam2014.drupal.org/session/deploying-your-sites-drush
[pullrequestbuilder]:   https://github.com/Lullabot/jenkins_github_drupal/
[pullrequestsession]:   https://amsterdam2014.drupal.org/session/github-pull-request-builder-drupal/
[herokuphp]:            https://blog.heroku.com/archives/2014/4/29/introducing_the_new_php_on_heroku/
[redhat]:               http://www.redhat.com/en/
[openshift]:            https://www.openshift.com/
[drupalquickstart]:     https://github.com/openshift/drupal-quickstart/
[openshiftorigin]:      https://openshift.github.io/
[drupal8beta]:          https://www.drupal.org/drupal-8.0.0-beta1
[openshiftd7]:          https://github.com/ctorgalson/openshift-d7
[rhccommandline]:       https://www.openshift.com/developers/rhc-client-tools-install
