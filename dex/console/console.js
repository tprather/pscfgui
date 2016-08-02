dex.console = {};

var logLevels = {
  'TRACE'  : 5,
  'DEBUG'  : 4,
  'NORMAL' : 3,
  'WARN'   : 2,
  'FATAL'  : 1,
  'NONE'   : 0
};

var logLevel = logLevels.NORMAL;

////
//
// dex.console : This module provides routines assisting with console output.
//
////

dex.console.logWithLevel = function (msgLevel, msg) {
//  console.log(dex.console.logLevel());
//  console.log(msgLevel);
//  console.dir(msg);
  if (dex.console.logLevel() >= msgLevel) {
    for (i = 0; i < msg.length; i++) {
      if (typeof msg[i] == 'object') {
        console.dir(msg[i]);
      }
      else {
        console.log(msg[i]);
      }
    }
  }
  return this;
}

dex.console.trace = function () {
  return dex.console.logWithLevel(logLevels.TRACE, arguments)
};

dex.console.debug = function () {
  return dex.console.logWithLevel(logLevels.DEBUG, arguments)
};

dex.console.log = function () {
  return dex.console.logWithLevel(logLevels.NORMAL, arguments)
};

dex.console.warn = function () {
  return dex.console.logWithLevel(logLevels.WARN, arguments)
};

dex.console.fatal = function () {
  return dex.console.logWithLevel(logLevels.FATAL, arguments)
};

dex.console.logLevel = function (_) {
  if (!arguments.length) return logLevel;
  logLevel = logLevels[_];
  return logLevel;
};