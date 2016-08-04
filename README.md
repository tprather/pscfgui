PSCFGUI
=======

The pscfgui application can be built for all of the possible platforms
using just one of the possible platforms.

  - If you happen to be building on linux, you must download node.js before
    downloading nw.js:

      ```
      sudo apt-get install node.js
      ```

    And, to get support for 3D density grid plots, you need OpenGL support.
    
      TBD - Not sure what this requires on linux or OS X.

The rest of the instructions should apply to building on any of the platforms.

  - Install NW.js from http://nwjs.io/downloads/.
  
      > The "NORMAL" version is fine unless you want the "Development Tools"
      > debugger available when the application is executed.
      > 
      > Unzip the downloaded file and put the resulting directory in your path.
      
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


  