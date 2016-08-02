PSCFGUI
=======

?????
To build:
  - Install NW.js from http://nwjs.io/downloads/.
  
       + On Linux
       
             sudo apt-get install node.js
             <then get nw.js and unsip it and put it in path>
             
  - Install nwjs-builder
  
      npm install nwjs-builder -g
      
  '''
  cd <dir with package.json in it>
  nwb download -f normal
  nwb nwbuild 
  '''