---
layout: post
title: "Drupal on Openshift Workflow"
date: 2014-10-14 13:00:00
categories: deployment
tags: Openshift deployment git maintenance devops
teaser: "Using openshift-d7 to set up test, staging, and production servers on
Openshift and deploy with git push"
published: true
---

## Goal: a complete Drupal workflow

The whole point for me of trying out Openshift with Drupal was to find
out if it could be a reliable and performant but low-cost tool for setting up a
complete dev-staging-production workflow. If there's no advantage to
traditional hosting platforms (or if it can't come close to the Drupal
specific solutions that already exist), we might as well not bother. The
first step was to [build a version of Openshift's Drupal Quickstart]({% post_url 2014-10-02-drupal-on-openshift-1 %}) that
could reliably reproduce the codebase of a Drupal site on Openshift from
one build operation to another.
