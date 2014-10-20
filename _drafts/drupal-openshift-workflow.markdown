---
layout: post
title: "Drupal on Openshift Workflow"
date: 2014-10-14 13:00:00
categories: deployment
tags: Openshift deployment git maintenance devops
teaser: "Using openshift-d7 to set up dev, and production servers on
Openshift and deploy with git push"
published: true
---

## The Goal: a complete Drupal workflow

The whole point for me of trying out Openshift with Drupal was to find
out if it could serve as a reliable and performant but low-cost tool for setting up a
complete dev-to-production workflow. If there's no advantage over
traditional hosting platforms (or if it can't come close to the Drupal
specific solutions that already exist), we might as well not bother.

### The fine print: what would it **look** like?

The first step was to [build a version of Openshift's Drupal
Quickstart]({% post_url 2014-10-02-drupal-on-openshift-1 %}) that
could reliably reproduce the codebase of a Drupal site on Openshift
from one build operation to another. That achieved, we need to ask "what would this kind of workflow look like?" What, in other words are the specific criteria that define a successful workflow?

My current Drupal-on-Openshift platform is Drupal 7-specific, and Drupal 7
famously mixes content and configuration in the database. This makes the
database end of deployments difficult. A very sophisticated solution to the configuration part of this problem&mdash;namely [Drupal 8's CMI][drupal8cmi]&mdash;already exists, so I won't attempt to solve it here. Instead, like [physicists neglecting friction][xkcd699],
I'm going to essentially ignore the database, and assume all database related deployments will be handled using:

1. [Deploy][deploymodule] or similar in the case of
   content,
2. [Features][featuresmodule] in the case of
   configuration (such as e.g. views, rules, content types etc)
3. modules generally in the case of pure code updates 

This means our feature set will need to be relatively straightforward:

- one codebase containing multiple branches in Git
- multiple running apps or sites on Openshift, each corresponding to a
  branch in Git
- automatic deployment (per branch) on `git push` 



## Steps

{% highlight bash linenos %}
# Clone or fork the repo: 
git clone https://github.com/ctorgalson/openshift-d7.git
# Create dev branch:
git checkout -b dev
# Create dev application:

{% endhighlight %}


[drupal8cmi]:      http://drupal8cmi.org/
[xkcd699]:         https://xkcd.com/669/
[deploymodule]:    https://www.drupal.org/project/deploy
[featuresmodule]:  https://www.drupal.org/project/features
