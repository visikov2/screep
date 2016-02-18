###Vagrant VM Initial Installation

__This is a non-SureDone developer box that creates a simple nginx vagrant box w/PHP+MySQL.__

__Blinking text message that says use Vagrant 1.6.5 to avoid problems__

__Attention Windows Users :__ All parts of this readme are written for *nix systems (OSX, Linux, etc) and assume a working and compliant terminal. Windows does not have such a native device. In our experience the the  __Power Shell__ included with the GitHub download will work asa substitute.  http://windows.github.com.

__1 :__ Vagrant is a development environment provisioning tool that runs on many VMs. [We use Virtual Box, it is free, get it here](https://www.virtualbox.org/wiki/Downloads). These instructions are for OSX and *nix. 

_Last full test is version *4.3.18*, newer versions seem to work fine. Be aware of this element should any problems arise and report them back to us._

__2 :__ [Download Vagrant](http://downloads.vagrantup.com/) and install.

_Last full test is version *1.6.5*, some problems were experienced on newer versions._

__3 :__ Create a folder where the virtual machine will live. Example ```/users/me/vagrant/```.

__4 :__ [You have already downloaded this repo](https://github.com/suredone/suredone-development), now copy the unzipped contents to the directory where you want your Vagrant VM to live and then ```cd``` into that directory. There should be a ```Vagrantfile``` visible now via ```ls```.

__5 :__  Run ```vagrant up``` in the terminal.

The box will download from Amazon. Windows has a bug(?) that can make the download slow. The *.box file is approx 900mb, a short download.  

__6 :__ Run ```vagrant ssh``` to ssh into the Vagrant box. 

### Inside Dev Box / VM

Get Vagrant running (previous) and be "vagrant ssh'ed" into the VM.

Run this command :

```
bash /vagrant/runonce.sh
``` 

__Once and only once__.

_* This script will modify files and directories and perform some cinematic housekeeping. Part of this script will rename the file to ```runonce.sh.ran_already``` to eliminate multiple execution._

Finally, start nginx by executing this command anytime the box is started (will not kick off nginx automatically) :

```
sudo /etc/init.d/nginx start
```

__The above command to restart nginx should be run each time the box is started.__

You are now done, let's test...

Go to the ip address http://192.168.33.33 and a message starting with :

```
This is the bootstrap file
...
```

should be seen with instructions on how to hook in your code and where+what is executing.

### How to get someting running on the box using a symbolic link

##### Symbolic Link Primer and Orientation with SureDone Box

http://en.wikipedia.org/wiki/Symbolic_link

In the Vagrant box directory ```/var/wwww/``` (```cd  /var/www```) the commans ```ls -al``` will list, in detail, all of the contents. It is from this area that the website "kicks off". The box is configured out of the gate to use ```index.php``` top include the ```bopotstrap.php``` file located in ```/vagrant```. In this use a PHP file is including another and makes things very easy to work with. 

For other applications and development types this will not work.  When multiple pages, files, and scripts need to be seen a sym-linked folder is required.  In this walk through a test folder will be placed for development. The test folder will be accessible at http://192.168.33.33/test and will execute code located at ```/vagrant/test/```.

First, create the symlink. There should __NOT__ be folders or files matching this path on the system (yet) :

```
/vagrant/test 
/var/www/test
```

Using the command :

```
ln -s /vagrant/test /var/www/test
```

a symbolic link is created as expected and outlined in the opening paragraph of this section.

The prototype for symbolic link creation is  :

```
ln -s /path/to/file /path/to/symlink
```

With successful creation of the symbolic link the address http://192.168.33.33/test/ should return "403 Forbidden". To remedy this place an ```index.php``` file in the ```/vagrant/test/``` directory. 

#### GTK 101 (good to know)

__How do I turn this thing off?__ :

If inside the vagrant box type ```exit``` in the terminal to escape to the parent operating system.

In the parent operating system use :

```
vagrant halt
```

to stop the box (graceful shutdown).

__Why is Vagrant cool?__ Read up over at the [Vagrant site](http://vagrantup.com). The 2 main points are:

1. The dev is reproduced quickly and accurately for local development
1. You edit code locally (in the OSX world) but run it in a Vagrant provisioned VM. This eliminated foolish ssh, ftp, scp, local "tunnels", and the other foolishness associated with VM box development. Edit locally, run virtualized as the ```/path/to/vagrant/on/your/machine/``` is the same as ```/vagrant/``` in the VM.


__How do I get to the VM once installed?__

The VM is provisioned to occupy [http://192.168.33.33/](http://192.168.33.33/)

__Files are not getting included that should be included!__

Permissions! Alternatively, sometimes ```chmod -R 777 /place/``` in the VM (Vagrant) does not work and the permissions must be modified in the parent OS (OSX/Mac). _Yes, 777 - thx PHP_

__How do I start up the machine after using ```vagrant up```?__

Generally this is the best command :

```
vagrant up --no-provision
vagrant ssh
# in the VM now
sudo /etc/init.d/nginx start
```

__To Restart Use :__

```
vagrant reload --no-provision
vagrant ssh
sudo /etc/init.d/nginx start
```
__Other :__

* ```vagrant destroy``` will destroy the VM and allow for reprovisioning
* Multiple VMs running at once can (will) get weird. 
* When your machine goes to sleep, weird things can also occur.
** It is suspected that process management on modern laptops will 'spin down' procs the make Vagrant mad. Give it s sec or a reload usually fixes the problem.


__How to Connect to MySQL / SSH__

If you like to use MySQL GUI like [Sequel Pro](http://www.sequelpro.com/) here are instructions to connect locally.

SSH is needed, test out ssh (with a running machine) using ```ssh vagrant@192.168.33.33``` and password "vagrant".

TO connect remotly locally (think about it) SSH is required. The following settings are required and in use :

* MySQL Host : 192.168.33.33
* PHPMYADMIN is included, check it out : http://192.168.33.33/phpmyadmin
* Username : root
* Password : empty aka no character
* Port : 3306
* SSH Host : 192.168.33.33
* SSH User : vagrant
* SSH Password : vagrant

#### PHP and Short-tag Use

The use of PHP's short-tags (```<? /*code*/ ?>```) is not supported. The opening PHP tag should be "full" as in ```<?php /*code*/ ?>```.

Should there be a need to flip short-tags on (temporarilly) see information located on the PHP website here : http://php.net/manual/en/ini.core.php#ini.short-open-tag

On the production environment no short-tags are supported.

#### Restarting PHP (daemon) 

```
# PHP 5 FPM is in use (Fast CGI)
sudo /etc/init.d/php5-fpm restart
```

#### Windows / Microsoft

Unexplained slow downloads and SSL errors have been reported on Windows machines. Use of this download manager seemed to break the bad cycle of slow download and SSL issues. From our experience a few tries might be needed to shake the bad mojo.

Should you be using Windows and Vagrant there are a few mild differences in how you approach the dev box. On a Mac the Unix/*nix compliant kernel and other operations make things very easy. Windows does __NOT__ have a native terminal and operates different enough to cause problems.  So there are a few extra tools that are required, nothing severe.

__Power Shell__ and other elements are part of the install available via http://windows.github.com.  This "shell" (air quotes) is part of the Windows+Github model. 

__Warning on caching in Windows__ : Windows is a very helpful program and will provide help in places you never expected. This note is regarding Windows __NOT__ downloading the devbox correctly and using a cached copy on the local system. So be aware of Windows trying to help.

You do not need PuTTY (or similar) to operate the box via SSH. Go here http://www.putty.org/ if you want it anyways. The Power Shell that comes with the GitHub install will allow all the SSH communication. 

Via PuTTy a user can SSH into the box. The command looks like :

```
ssh vagrant@192.168.33.33
```

The password is ```vagrant```.

This style of SSH is __NOT__ the same as the ```vagrant ssh```. In short, operating via a ```vagrant ssh``` connection provides sudo-less root style administration for the user. This makes things much easier and tends to not cause additional problems with file permissions, ACL, user/group and other *nix oddities that will pop up in Windows.

Windows note 1 : Execute ```vagrant ssh``` using Power Shell. Windows Power Shell, currently, is the best terminal we know of for Windows operating systems to interact with Vagrant.

