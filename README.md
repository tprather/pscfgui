PSCFGUI
=======

The pscfgui application can be built for all of the possible platforms
using just one of the possible platforms.

  - If you happen to be building on linux, you must download node.js before
    downloading nw.js:

      ```
      sudo apt-get install node.js
      ```
      
    And, to get support for 3D density grid plots, you need OpenGL support
    as provided by Mesa.
    
      ```
      sudo apt-get install chromium-chromedriver
      sudo apt-get install chromium-browser
      
      
      sudo apt-get install libdrm-dev
      sudo apt-get install x11proto-dri3-dev,x11proto-present-dev
      sudo apt-get install llvm-dev
      cd <directory-where-you-can-build-mesa-source>
      wget https://mesa.freedesktop.org/archive/12.0.1/mesa-12.0.1.tar.gz
      tar zxf mesa-12.0.1.tar.gz
      cd mesa-12.0.1
      configure --enable-gles1 --enable-gles2
      make
      ```

The rest of the instructions should apply to building on any of the platforms.

  - Install NW.js from http://nwjs.io/downloads/.
  
      > The "NORMAL" version is fine unless you want the "Development Tools"
      > debugger available when the application is executed.
      > 
      > Unzip the downloaded file and put the resulting directory in your path.
      
  - Install keypress.
  
      ```
      # npm install keypress
      npm install terminal-kit
      ```

  - Install nw-builder
  
      ```
      npm install nw-builder -g
      ```

  - Use nwbuild to create a package for each platform.
  
      ```
      cd <parent of dir with package.json in it>
      nwbuild --platforms="win32,win64,linux32,linux64,osx64"
      ```
      
      > This will create a "build" subdirectory which contains a subdirectory
      > for each platform: "win32", "win64", ...
      > 
      > Each of the platform subdirectories should be zip'd as the executable
      > package for that platform.
      
      > The installation instructions for each package are:
      
      >   + Download the package appropriate to your platform.
      >   + Unzip it and add the resulting directory to your path.
      >   + Execute "pscfgui".


  