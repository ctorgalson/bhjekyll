---
layout: post
title:  "Passwordless SSH Access"
date:   2014-11-02 13:00:00
categories: Maintenance
tags: ssh development ssh-add ssh-copy-id homebrew osx lastpass
teaser: "Access your remote server(s) safely without having to use passwords"
published: true
---

## SSH passwords are a pain. So are usernames.

So, for that matter, are hostnames, ports, and IP addresses.

If you're regularly doing maintenance on websites or web apps, chances
are you're logging into remote servers using SSH. But even if you use a
password manager&mdash;and if you don't you should&mdash;SSH passwords
are a pain. Usually it's necessary to switch away from the terminal,
retrieve the password, switch back to the terminal, and then proceed
with the login. You probably also need to retrieve the hostname or IP
address, ssh port, and username. Not convenient.

This workflow can be gotten around using tools like
[Coda][panic-coda], and [Lastpass's new command-line tools][lastpass-cli],
but if you don't use Coda, and if you don't use Lastpass, then you can be
stuck using passwords (in fact, the solution I explain below can also be
used with Coda).

## So what's the alternative?

The alternative is [public key authentication][wiki-public-key]. Essentially,
you achieve this by generating public and private cryptographic keys and copying
the public key to each remote server. On ssh login, if these keys correspond,
no password will be required.

Setting this up is not difficult, but it does require that you be comfortable
in the terminal (but so does SSH after all&hellip;) The directions that follow
assume you're running some reasonably recent version of OSX, but the basic steps
would be the same on Linux systems.

## Set it up

### 1. Generate a public-private key pair

The first thing you need is to create the actual public-private key pair using
[`ssh-keygen`][osx-ssh-keygen]. It's important to remember that your keys are
sensitive information.

#### 1a. Passphrase-protect your key

The `ssh-keygen` command will prompt (but not require)
you to use a passphrase. I strongly encourage the use of passphrases with SSH
keys. It means you'll have to re-enter the passphrase *the first time* you make
an SSH connection using that key when you restart or re-login to your computer, 
but since the key can be used to connect to  multiple systems, the extra 
security is essential.

#### 1b. Give your key a custom name

I create different keys with their own names for different purposes. For 
example, I might create one named after my employer for use at work and a 
different one for use on side projects. This means that if ever I need to retire 
a given key pair, I won't have to reconfigure my authentication for *every* 
server I need to connect with.

The following command will create a custom-named public-private key pair in the 
conventional directory (change the 'demo_key' text to change the name of your 
key):

`ssh-keygen -b 4096 -t rsa -f ~/.ssh/demo_key`

There are three flags used in the command:

- `-b`: number of bits in the created key; very generally, more is better and 4096 should be ok
- `-t`: type of key; use 'rsa'
- `-f`: file name; use this to name your key; unless you have some good reason not to, put it in the `.ssh` directory with your other key(s)

The whole creation process should go something like this (again, I encourage
you to use a passphrase when creating your key):

{% highlight console linenos %}
Username$ ssh-keygen -b 4096 -t rsa -f ~/.ssh/demo_key
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /Users/Username/.ssh/demo_key.
Your public key has been saved in /Users/Username/.ssh/demo_key.pub.
The key fingerprint is:
dd:6b:c9:de:d0:df:3c:74:92:97:1c:97:7b:7d:9b:fb Username@Username.local
The key's randomart image is:
+--[ RSA 4096]----+
|                 |
|                 |
|                .|
|         . .   o.|
|        S . . ..*|
|           . +o=*|
|            * oo*|
|           o o *.|
|            . ..E|
+-----------------+
{% endhighlight %}

### 2. Copy your public key to your server(s)

In principle, it's quite possible to get your public key to the remote server [in a variety of ways][osxdaily-passwordless]. However, since the public key must be copied into a specific file with specific permissions in a specific directory, I prefer to use a purpose-built tool, `ssh-copy-id` (and I prefer to [install it using Homebrew][how-ssh-copy-id]).

Using `ssh-copy-id`, transferring your public key to the server is a cinch:

`ssh-copy-id -i ~/.ssh/demo_key.pub -p 1234 user@example.com`

The parts of this command are:

- `-i`: the location of the public key file
- `-p`: the SSH port (leave this out if you connect to SSH on port 22)
- `user@example.com`: this is the username/hostname combination you generally use to connect to your server

You'll be prompted to enter your password, but this should be the last timer.
The tool will also suggest you check to see that the right key was added. This
means you need to:

- SSH to the server (you should already be able to do this passwordless: `ssh user@example.com`)
- inspect the contents of `~/.ssh/authorized_keys` to make sure your new key is present

### 3. Create an alias to the server

This is the part I really enjoy about passwordless SSH. Typing `ssh user@example.com` without needing to enter a password is good, but it turns out that we can shorten or simplify the command itself.

We've already elminiated the password, but we can also create a file containing the remainder of the information we need to login, the username, hostname (or IP), and the port (if not '22').

#### 3a. Create `~/.ssh/config`

Create a new file in your `.ssh` directory called simply `config`. This file will contain all the information you use to connect to your various SSH host machines.

#### 3b. Add the alias to the file

The file is a simple text file, and the entries look like this:

{% highlight console linenos %}
Host example
  Hostname example.com
  Port 1234
  User user
{% endhighlight %}

Here, we record the username (`user`), the hostname (`example.com`), and the 
port (`1234`). We also have a line beginning with `Host`. This is the shortcut 
we'll use for SSH connections for now on. So our command which used to be `ssh 
user@example.com -p 1234` (plus password) will now be `ssh example` (*without* a 
password).

## Extras

When I first set this up, I was ecstatic just at the prospect of being able to 
have instant SSH access to servers I needed to work on directly from the 
terminal (I do almost all of my coding in Vim, so I'm usually working in a 
terminal in the first place). But besides that, there are a couple of things to know when passwordless SSH is part of your regular workflow.

### It works with SCP

This is a teriffic side benefit. As development has moved away from the use of 
FTP, we really don't do as many manual file transfers as we used to. However 
it's still sometimes necessary to transfer a tarball, database dump, or other 
file from a development machine to some remote server.

The safe way to do this is to use SCP. Happily, our passwordless SSH setup works 
directly with SCP. Using our above example we can transfer a file up or down 
using the alias from the config file:

- Upload: `scp ./local-file.txt example:~/local-file.txt`
- Download: `scp example:~/remote-file.txt ./remote-file.txt`

### Enabling passphrase-protected keys

If you passphrase-protect your keys (as suggested above), you'll need to 
authenticate before you can use them. This is done with the `ssh-add` command:

`ssh-add ~/.ssh/example`

This produces a dialogue like this:

{% highlight console linenos %}
Username$ ssh-add ~/.ssh/demo_key
Enter passphrase for /Users/Username/.ssh/demo_key:
Identity added: /Users/Username/.ssh/demo_key (/Users/Username/.ssh/demo_key)
{% endhighlight %}

### Removing access to a remote server

When using passwordless SSH logins, the private key is stored on the local 
machine, but the public key resides on as many servers as the local machine has 
access to. These keys must sometimes be removed if an employee moves, a 
temporary job finishes, or a client moves on.

To do this, all that's necessary is to log into the server (passwordless!) open 
the file at `~/.ssh/authorized_keys`, and delete the line containing the 
relevant key.

[panic-coda]:        https://www.panic.com/coda/
[lastpass-cli]:      http://blog.lastpass.com/2014/10/open-sourced-lastpass-command-line.html
[wiki-public-key]:   http://www.wikiwand.com/en/Public_key_infrastructure
[osx-ssh-keygen]:    https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/ssh-keygen.1.html
[osxdaily-passwordless]: http://osxdaily.com/2012/05/25/how-to-set-up-a-password-less-ssh-login/
[how-ssh-copy-id]:   http://stackoverflow.com/questions/25655450/how-do-you-install-ssh-copy-id-on-a-mac
