---
title: |
  CITS3007 lab 1&nbsp;--&nbsp;Development environment
---



## 1. Setting up the C development environment { #c-devel-env }

To complete the lab work for this unit, you will need access to a
standardised C development environment – the one we use is based on
Ubuntu 20.04.

To access the environment, there are two options:

- Install two open source tools ([VirtualBox][virtualbox] and
  [Vagrant][vagrant]) on your laptop or home PC. See
  [VirtualBox and Vagrant](#virtualbox-and-vagrant), below.

Or alternatively:

- Access the development environment on the Web using [GitPod][gitpod]
  (which provides web-based access to development environments
  hosted in the cloud). See [Using GitPod](#using-gitpod), below.

[virtualbox]: https://www.virtualbox.org
[vagrant]: https://www.vagrantup.com
[gitpod]: https://gitpod.io/

For most purposes, either of these options will be fine; we will let you
know for particular labs if anything more is needed.

VirtualBox is not available for ARM64-based Macs (i.e. the "M1" series
Macs). If you use such a Mac, then you should use the GitPod
web-based environment.

[utm]: https://mac.getutm.app

### VirtualBox and Vagrant { #virtualbox-and-vagrant }

To install VirtualBox and Vagrant:

1.  Visit <https://www.virtualbox.org/wiki/Downloads>, download
    the appropriate VirtualBox package for your platform (Windows, MacOS or Linux),
    and install it.

    (On Windows, the installer is an `.exe` file you can simply run.  on
    MacOS it will be a `.dmg` file and on Ubuntu distributions a `.deb`
    file: we assume you already know how to install these.)

#.  Visit <https://www.vagrantup.com/downloads>, download the
    appropriate Vagrant package for your platform, and install it.

    On Windows, the installer is an `.msi` file you can run by
    double-clicking. On MacOS, you can either download a `.dmg` file, or
    (if you have [Homebrew](https://brew.sh) installed) there are
    instructions for adding Vagrant with a `brew install` command.

    <!--
    macos old intel: may hit network issue, just google and amend
    vagrantfile
    -->

#.  Check that Vagrant has been successfully installed.

    On Windows, open a "Command Prompt" window. On MacOS or Linux, open
    a terminal window.

    Then type `vagrant --version`; Vagrant should display

    ```
    Vagrant 2.2.19
    ```

#.  Test a small virtual machine (VM) image. Create a new directory
    (called e.g. `vagrant-test`), open a terminal window and `cd` into
    the directory.

    Type `vagrant init generic/alpine316`, then `vagrant up
    --provider=virtualbox`.  Vagrant should take about a minute to
    download a virtual machine containing [Alpine Linux][alpine] and
    configure it for use.

    If you type `vagrant ssh`, Vagrant will connect to the new virtual
    machine using [`ssh`][ssh] and present you with a shell prompt:

    ```
    $ vagrant ssh
    alpine316:~$
    ```

    If this works, you can simply exit the shell by typing `exit` or
    hitting `ctrl-D`. If it doesn't, please see one of the lab
    facilitators for assistance.

    (Note that on Linux, if you already have `libvirt` installed:
    `libvirt` and VirtualBox can't both run at the same time. Ensure
    that `libvirt` isn't running by typing `sudo systemctl stop
    libvirtd`.)

    [alpine]: https://www.alpinelinux.org
    [ssh]: https://www.ssh.com/academy/ssh

#.  Download a VM containing the standard CITS3007 development
    environment. Note that this will likely take **around 5--10
    minutes**, so once you've started the process, move onto the next
    exercise.

    Create a new directory (called e.g. `cits3007-test`), open a
    terminal window and `cd` into the directory.

    Type `vagrant init arranstewart/cits3007-ubuntu2004`, then `vagrant
    up --provider=virtualbox`.  Vagrant should take around 5--10 minutes
    to download a virtual machine and configure it for use. The output
    from Vagrant should look something like the following:

    ```
    Bringing machine 'default' up with 'virtualbox' provider...
    ==> default: Importing base box 'arranstewart/cits3007-ubuntu2004'...
    ==> default: Matching MAC address for NAT networking...
    ==> default: Checking if box 'arranstewart/cits3007-ubuntu2004' version '0.1.2' is up to date...
    ==> default: Setting the name of the VM: xxx-cits3007-test_1658816964468_16898
    ==> default: Clearing any previously set forwarded ports...
    ==> default: Fixed port collision for 22 => 2222. Now on port 2200.
    ==> default: Clearing any previously set network interfaces...
    ==> default: Preparing network interfaces based on configuration...
        default: Adapter 1: nat
    ==> default: Forwarding ports...
        default: 22 (guest) => 2200 (host) (adapter 1)
    ==> default: Booting VM...
    ==> default: Waiting for machine to boot. This may take a few minutes...
        default: SSH address: 127.0.0.1:2200
        default: SSH username: vagrant
        default: SSH auth method: private key
        default: Warning: Connection reset. Retrying...
        default: Warning: Remote connection disconnect. Retrying...
        default: Warning: Connection reset. Retrying...
        default:
        default: Vagrant insecure key detected. Vagrant will automatically replace
        default: this with a newly generated keypair for better security.
        default:
        default: Inserting generated public key within guest...
        default: Removing insecure key from the guest if it's present...
        default: Key inserted! Disconnecting and reconnecting using new SSH key...
    ==> default: Machine booted and ready!
    ==> default: Checking for guest additions in VM...
    ==> default: Setting hostname...
    ```

    Once it's done, you can type `vagrant ssh` to get shell access to
    the new VM:

    ```
    $ vagrant ssh
    vagrant@cits3007-ubuntu2004:~$
    ```

#.  Optional: install VS Code and the "Remote-SSH" extension.

    The standard CITS3007 development environment VM comes with the
    `vim` editor already installed, but many people find it more
    comfortable developing and debugging code using a graphical
    editor.

    [Visual Studio Code][vs-code] (VS Code) works well on Windows, Mac
    and Linux computers, and allows you to seamlessly write and debug
    code on a Vagrant VM.

    Once you've got a CITS3007 development environment VM running (see
    the last step), install VS Code by downloading it from
    <https://code.visualstudio.com>.

    Start VS Code (on Linux or MacOS, the command to do so from the
    terminal is just `code`), and from the menu select 'File' /
    'Preferences' / 'Extensions'. In the search box at the top left of
    the window, type `remote ssh` and hit enter. The top hit should be
    the "Remote - SSH" extension; select it, then click the "install"
    button.

    `<div style="display: flex; justify-content: center;">`{=html}
    ![](images/remote-ssh-extension.png "installing the remote-ssh extension")
    `</div>`{=html}

    In the lower left corner of the window you should see a button with
    facing angle bracket symbols ("><") – click on it:

    `<div style="display: flex; justify-content: center;">`{=html}
    ![](images/new-ssh-config.png "new remote-ssh connection")
    `</div>`{=html}

    VS Code will then offer several options -- select "Open SSH
    configuration file".

    ![](images/new-ssh-config2.png "new remote-ssh connection")

    Select the first configuration file VS Code suggests and open it.

    Now, in the terminal window from which you started the Vagrant VM,
    type `vagrant ssh-config`.

    Vagrant will output configuration settings which can be used with
    `ssh` – something like the following:

    ```
    Host default
      HostName 127.0.0.1
      User vagrant
      Port 2200
      UserKnownHostsFile /dev/null
      StrictHostKeyChecking no
      PasswordAuthentication no
      IdentityFile /home/smithj/cits3007-test/.vagrant/machines/default/virtualbox/private_key
      IdentitiesOnly yes
      LogLevel FATAL
    ```

    Paste this `ssh` configuration into the file which is open in VS
    Code, and save it.  You may want to change the first line from `Host
    default` to something more informative, like `Host cits3007-test`.

    Pasting this configuration informs VS Code about the new VM and how
    to connect to it. If you again click on the "remote window" button
    in the lower left corner of VS Code, one of the options is "Connect
    to Host", and if you select *that*, one of the options should be the
    new VM you specified (e.g. `cits3007-test`).

    VS Code will open a new window (and spend a few seconds setting up
    some software on the VM): in this window, you can use VS Code as
    normal, but all files you can access will be on the virtual machine.

[vs-code]: https://code.visualstudio.com

#### Vagrant cheat sheet

You can find a useful "cheat sheet" of commands for managing Vagrant VMs
here:
<https://cheatography.com/davbfr/cheat-sheets/vagrant-cheat-sheet/>.


### Using GitPod { #using-gitpod }

If you don't have access to a laptop or home computer on which you
can install VirtualBox and Vagrant, then another option is to use
a cloud-based development VM provided by [GitPod][gitpod].

You'll need to have a GitHub account for this, so if you don't have
one already, visit <https://github.com/> and create one.

Once that's done, paste the following URL into your browser:

&nbsp; <https://gitpod.io/#https://github.com/cits3007/ubuntu-gitpod>

You'll be prompted to use GitHub to access GitPod:

`<div style="display: flex; justify-content: center;">`{=html}
![](images/gitpod-agreement.png "gitpod agreement")
`</div>`{=html}

Click "Continue with GitHub".

GitPod will start a cloud-based virtual machine in which the standard
CITS3007 environment is available, and the latest version of
[Visual Studio Code][vs-code] (VS Code) editor is running:

![](images/gitpod-env.png "gitpod environment")

Initially, VS Code will start with the folder `/workspace/ubuntu-gitpod`
open, which contains code downloaded from
<https://github.com/cits3007/ubuntu-gitpod>. However, you can easily
create and open new folders if desired.


### Using UTM **[DEPRECATED]** { #using-utm }

If you have an ARM64-based Mac, then no version of VirtualBox currently
exists which can run on your computer.

<div style="border: solid 2pt red; background-color: hsla(0, 100%, 80%, 1); padding: 1em;">

Unfortunately, the UTM interface seems to have changed in the week
since the lab was written, and the UTM site does not provide
updated documentation.

You are welcome to experiment with UTM if you wish, but we can't provide
any assistance or support, and recommend you
[use the web-based GitPod](#using-gitpod) interface for labs.

</div>

You might like to experiment with [UTM][utm], which lets you
create and run virtual machines on M1 series Macs. However, our teaching
staff won't be able to troubleshoot any issues that arise with UTM -- if
you run into problems, your best bet is to search the [MacRumors
forum][macrumors-forum]
at
<https://forums.macrumors.com/> or the UTM "issues" page at
<https://github.com/utmapp/UTM/issues> to see if there is a known
solution to your problem.

[macrumors-forum]: https://forums.macrumors.com/>

The steps to install and use UTM are as follows:

1.  Visit <https://mac.getutm.app/>,
    download the `.dmg` file for UTM, and install UTM.

#.  To quickly test whether UTM will work for you, we recommend downloading
    and using a small VM image containing the [Alpine Linux][alpine]
    distribution.

    In a terminal window, create a new directory (e.g. `alpine-test`),
    `cd` into it, and type

    ```
    $ curl -L -o alpine.qcow2 https://vagrantcloud.com/generic/boxes/alpine316/versions/4.1.0/providers/libvirt.box
    ```

    This will download a virtual machine image containing Alpine Linux,
    and save it as a file named `alpine.qcow2`.

#.  Then run UTM, and create a new virtual machine by clicking on the plus
    (`+`) symbol. Give your new VM a name (e.g. "alpine-test") in the
    "Information" tab; in the "System" tab, specify "`x86_64`" as the
    architecture, and 2048MB as the amount of memory to use. (You can
    specify more, if you wish, but it's best not to use more than half
    the RAM available on your computer.)

    Under the "Drives" tab, select "Import drive", and then the `.qcow2`
    file you just downloaded.

    You should then be able to start the new VM. To log in, the username and
    password should both be set to "vagrant".

    It should be possible to `ssh` to the new VM by setting the "Port
    Forward" settings under the "Network" tab (while the VM is powered off).
    If you forward port 2222 from your host machine to port 22 of the VM,
    then typing `ssh -p 2222 vagrant@localhost` from a terminal window on
    the host should connect you to the VM.

#.  Assuming you're able to get the Alpine Linux image working, try using
    the full CITS3007 development environment.  It can be downloaded
    using the `curl` command invocation

    ```
    $ curl -L -o cits3007.qcow2 https://vagrantcloud.com/arranstewart/boxes/cits3007-ubuntu2004/versions/0.1.2/providers/libvirt.box
    ```

    and typically takes 5-10 minutes to download.

    Then follow similar steps as before to create a new VM from the
    downloaded image and connect to it using `ssh`. (Again, the username
    and password will both be set to `vagrant`.)

## 2. Concept review questions

If possible, it's recommended you work on this section in pairs and
compare answers.

### 2.1. Definitions

For each of the following concepts, review the definition given in the
lecture slides, and explain it in your own words and/or give an example:

a. threat
#. vulnerability
#. confidentiality
#. integrity
#. availability







### 2.2. Concepts

a.  How would you describe the relationship between threats,
    vulnerabilities, and attacks? Give examples to illustrate the
    relationship.





#.  Is it possible for a *threat* and a *vulnerability* to both exist,
    without there being an attack? Explain why or why not.



#.  Consider an ATM, which requires users to provide a bank card and a
    PIN in order to perform transactions. Give examples of
    *confidentiality*, *integrity* and *availability* requirements
    associated with the system. How important do you think each
    requirement is -- are they all equally important, or does the
    importance differ?



## 3. AusCERT security bulletins

[AusCERT][auscert] is a non-profit organisation that provides advice on cybersecurity
threats and vulnerabilities. Some of its information is publicly
available, and some is provided only to members.

Visit its website at <http://www.auscert.org.au/>, and from the
"Resources" tab, select "Security Bulletins". (The direct link is
<https://auscert.org.au/bulletins/>.)

Take a look at several, and try searching for
`ASB-2022.0077` and `ESB-2022.3655`. All bulletins have the following
features:

- They have an *ID number*. Bulletins with an ID number
  beginning with "ESB" are bulletins from external sources, being
  redistributed by AusCERT; those beginning with "ASB" are published by
  AusCERT itself. The ID number contains 4 digits indicating what year the
  bulletin was published, followed by the bulletin number within that
  year.
- They specify the product affected by some vulnerability, the operating
  system affected, and what the *resolution* (i.e. action to be taken,
  in order to mitigate or prevent the vulnerability) is.
- They refer to one or more *CVE* identifiers. The CVE ("Common Vulnerabilities and
  Exposures") identification scheme is provided by the US-based MITRE
  organisation. For instance, Auscert's bulletin `ASB-2022.0129`
  refers to `CVE-2022-30168`, the details of which can be found at
  <https://www.cve.org/CVERecord?id=CVE-2022-30168>.
- They give a CVSS (Common Vulnerability Scoring System) score. This is
  a way of quantifying the severity of a vulnerability using a number
  from 0 to 10, where 0 is the least severe and 10 the most.
  Read more about these severity ratings at
  <https://nvd.nist.gov/vuln-metrics/cvss>.

Read the `ESB-2022.1671` bulletin and the NIST page on severity ratings,
and answer the following questions:

a.  The bulletin is for a patch which fixes a *vulnerability*.
    What is the vulnerability (give a CVE identifier and a description)?
    In what product does it occur?



#.  How severe is the vulnerability? If a vulnerability is severe, does
    that necessarily mean it is easy to exploit, and/or has a high
    probability of being exploited?





Locate the CVE information page on <https://www.cve.org> for
this vulnerability, and follow the links there to find out more
about it. Google for the definitions of any terms you do not know --
[Wikipedia](https://en.wikipedia.org/) has good summaries of most terms.
Answer the following questions:

c.  How could an attacker exploit this vulnerability? Describe
    a scenario in which this could occur.




#.  Of the "C I A" security goals -- which ones could be compromised
    if this vulnerability were exploited?







[auscert]: http://www.auscert.org.au/

## 4. C development

Ideally, you should be doing this unit in your 3rd year, and have some
familiarity with the C programming language. If not, you may find the
following websites useful:

- Carl Burch, [*C for Python programmers*][c-for-py]
  - Slides based on [*C for Python programmers*][c-for-py-slides]
- Steven Simpson, [*Learning C from Java*][c-from-java]
- Daniel Weller and Sharat Chikkerur, [Practical Programming in C][prac-c] (lecture slides)

[c-for-py]: http://www.cburch.com/books/cpy/index.html
[c-for-py-slides]: https://web.cs.hacettepe.edu.tr/~bbm101/fall16/lectures/w12-c-for-python-programmers.pdf
[c-from-java]: https://ssjools.hopto.org/java2c/alldiffs
[prac-c]: https://ocw.mit.edu/courses/6-087-practical-programming-in-c-january-iap-2010/pages/lecture-notes/

### 4.1. C questions

a.  What is the difference between the C literal values `3`, `'3'`,
    `"3"` and `3.0`? What is the type of each?







#.  Consider the following C code:

    ```C
    const char * str = "test";
    char c = str[0];

    if (c >= 65 && c <= 90) {
      printf("high\n");
    } else if (c >= 97 && c <=122) {
      printf("low\n");
    } else {
      printf("other\n");
    }
    ```

    If this code is executed, what will be printed to the terminal?




#.  What is the output of the question (b) code if we change the string
    `"test"` to `"TEST"`?




#.  What is the output of the question (b) code if we change the string
    `"test"` to `"???"`?



### 4.2. Cloning from `git` and modifying C programs

1.  If you don't already have one, create an account on
    [GitHub](https://github.com). `ssh` into the VM instance you created
    in section 1 ["Setting up the C development
    environment"]("#c-devel-env) (or, if using GitPod -- use the
    "terminal" window in GitPod).

2.  Visit <https://github.com/cits3007/lab01-leap-year> to look at the
    sample Git repository for this lab. You can download it by running
    (at the terminal)

    ```
    $ git clone https://github.com/cits3007/lab01-leap-year.git
    ```

    This will create a directory `lab01-leap-year` containing the repository
    code; `cd` into it, and run the following commands to tell `git` who
    you are

    ```
    $ git config --global user.name 'John Smith'
    $ git config --global user.email 'mygithubaccount@users.noreply.github.com'
    ```

    replacing "John Smith" with your own name, and `mygithubaccount` with your
    GitHub username.

    <div style="border: solid 2pt orange; background-color: hsl(22.35, 100%, 85%, 1); padding: 1em;">

    **Networking issues?**

    If `git clone` fails due to network connectivity issues, here are a couple of quick fixes to try:

    - In the VM, run the command

      ```
      $ echo nameserver 8.8.8.8 | sudo cat -a /etc/resolv.conf
      ```

      This can fix issues with DNS ("Name or service not known"), as it points the VM
      to a Google-maintained DNS server at IP address 8.8.8.8.

    - For the moment, try using a different VM image -- in a fresh directory, try `vagrant init bento/ubuntu-20.04`
      and repeat the steps for bringing a VM up.

      Within the VM, you'll want to run `sudo apt install build-essential` to ensure `gcc` and `make` are
      installed. This image will be OK to use for the next few labs, til we can diagnose the problem.


    </div>

3.  Build the `test_leap` program by typing `make`, then try running it
    with various different command-line arguments:

    ```
    $ ./test_leap 1901
    $ ./test_leap 1900
    $ ./test_leap 2000
    $ ./test_leap -1
    $ ./test_leap -0
    $ ./test_leap 9223372036854775807
    $ ./test_leap 9223372036854775808
    $ ./test_leap foo
    $ ./test_leap foo bar
    ```

    What results do you get? Take a look at the code in `test_leap.c`,
    read the documentation for the `strtol` function (by running
    `man strtol`),
    and explain what is happening in each case.



4.  Create a repository on GitHub that will hold your own version of
    this code. Visit <https://github.com>, click on the plus ("+")
    symbol in the top right-hand corner of the page, select "new
    repository", and give your repository a name (e.g.
    "cits3007-test-repo") under "Repository name". ("Owner" should be
    set to your GitHub account name.)

    Then click "Create repository".

5.  You'll need to create an SSH id, for use with GitHub.

    Type `ssh-keygen` in the VM, and hit "`enter`" in response to any
    questions.

    Type `cat ~/.ssh/id_rsa.pub` in the VM -- a long line starting with
    "`ssh-rsa`" should be displayed.

    Go to "GitHub settings" (top right of the GitHub page, and select
    "Settings" from the drop-donw menu), then "SSH and GPG keys",
    and click "new SSH key".

    Give your SSH key a name (e.g. "cits3007 ssh key"), then paste the
    output of the `cat` command into the box marked `key`, and click
    "Add SSH key".

6.  In your Linux terminal, type

    ```
    $ git remote remove origin
    $ git remote add origin git@github.com:mygithubaccount/cits3007-test-repo.git
    $ git push -u origin master
    ```

    replacing "`cits3007-test-repo`" with the name of the repository you
    created in step 4, and `mygithubaccount` with your GitHub
    username.

    When you originally cloned the repository, you created a local
    repository (contained in the VM) which was "linked" to the remote
    GitHub repository hosted at
    <https://github.com/cits3007/lab01-leap-year>.

    The commands above remove the link to
    <https://github.com/cits3007/lab01-leap-year> (since you don't have
    permission to write to that repository), and replace it with a link
    to the new repository you *can* write to.

    The SSH key you've created consists of two parts -- a *public* part,
    located in `~/.ssh/id_rsa.pub` on the VM, which you can freely share with
    anyone, and a *private* part (located in `~/.ssh/id_rsa` on the VM), which you
    should keep secret. You will probably want to store these for later
    use. Running

    ```
    $ vagrant ssh -- cat ~/.ssh/id_rsa.pub > id_rsa.pub
    $ vagrant ssh -- cat ~/.ssh/id_rsa > id_rsa
    ```

    will copy the files to your host machine so you can use them later.
    (Type `vagrant upload --help` for information on how you can upload
    them to another VM.)

6.  The code in `test_leap.c` contains an error. The correct algorithm
    for determining whether a year is a leap year is outlined at
    <https://en.wikipedia.org/wiki/Leap_year#Algorithm>, but the code in
    `test_leap.c` incorrectly reports that (for instance) 1900 is a leap
    year, when it is not. (Can you spot any other errors? Feel free to
    post in the Help3007 forum if you can.)

    Fix the code in `test_leap.c` and test your changes by trying the
    values from step 3 again.

    Then, when you are satisfied, run the command `git push` to
    push your changes to the GitHub-hosted remote version of your
    repository.

    Compare your changes with another student's – are there any
    differences between how you fixed the program?







### 4.3. Using version control and backing up

If you haven't used `git` for version control before, it's suggested you
work through the "[Version Control with Git][sw-carp-git]" exercises
published by [Software Carpentry][sw-carp]:

- <https://swcarpentry.github.io/git-novice/>

If you *have* used `git` before, you may still find the following "cheat
sheet" useful for refreshing your memory of Git's commands:

- <https://education.github.com/git-cheat-sheet-education.pdf> (PDF)

It's expected that you keep your project work for CITS3007 under version
control (so that facilitators can easily see what work you've already
done, and what you're currently trying to do), and that you keep an
up-to-date remote copy of your code with a Git hosting provider such as
GitHub – make sure you `git push` to it frequently. You don't have to
use GitHub if you prefer to use another provider ([GitLab][gitlab] is
another popular one), and you can even host the repository yourself if
you have some reliable way of doing so.

It's also expected that you will keep reliable backups of any work you
submit – visit <https://missing.csail.mit.edu/2019/backups/> for an
explanation of what is a reasonable approach to backing up (namely,
following the "3-2-1" rule). While GitHub is a good offsite location for
hosting source code, you may also wish to back up other sorts of work
and documents.  Offsite copies of non-code work can be stored using the
[*student network storage*][stud-storage], or alternatively, backup
services can be purchased for as little as $5 per month (e.g. from
<https://www.carbonite.com>).[^tarsnap]

Ways of using the student network storage are explained on the UWA Library
page "[Student email and collaboration tools][stud-collab]", under the
heading "Access the student collaboration tools".


[sw-carp-git]: https://swcarpentry.github.io/git-novice/
[sw-carp]: https://software-carpentry.org/lessons/index.html
[gitlab]: https://about.gitlab.com
[stud-storage]: https://www.it.uwa.edu.au/it-help/storage
[stud-collab]: https://www.uwa.edu.au/library/Help-and-support/Student-email-and-collaboration-tools

[^tarsnap]: Another option is [Tarsnap][tarsnap], which is very cheap,
  but rather complex to set up.
  The MIT page at <https://missing.csail.mit.edu/2019/backups/> lists other backup
  hosting providers under "Resources".

[tarsnap]: https://www.tarsnap.com



<!-- vim: syntax=markdown tw=72 smartindent :
-->
