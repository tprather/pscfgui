/**
 *
 * @module dex.config
 *
 * This module contains many support routines for configuring things.
 *
 */
dex.config = {};

/**
 * This routine will expand hiearchically delimited names such as
 * foo.bar into a structure { foo : { bar : value}}.  It will delete
 * the hierarchical name and overwrite the value into the proper
 * location leaving any previous object properties undisturbed.
 *
 * @param {Object} config The configuration which we will expand.
 *
 */
dex.config.expand = function (config) {
  var name,
    ci,
    expanded;

  // We have nothing, return nothing.
  if (!config) {
    return config;
  }

  // Make a clone of the previous configuration.
  expanded = dex.object.clone(config);

  // Iterate over the property names.
  for (name in config) {
    // If this is our property the process it, otherwise ignore.
    if (config.hasOwnProperty(name)) {
      // The property name is non-null.
      if (name) {
        // Determine character index.
        ci = name.indexOf('.');
      }
      else {
        // Default to -1
        ci = -1;
      }

      // if Character index is > -1, we have a hierarchical name.
      // Otherwise do nothing, copying was already handled in the
      // cloning activity.
      if (ci > -1) {
        // Set it...
        dex.object.setHierarchical(expanded, name,
          dex.object.clone(expanded[name]), '.');
        // Delete the old name.
        delete expanded[name];
      }
    }
  }

  //dex.console.log("CONFIG", config, "EXPANDED", expanded);
  return expanded;
};

/**
 *
 * This routine will take two hierarchies, top and bottom, and expand dot ('.')
 * delimited names such as: 'foo.bar.biz.baz' into a structure:
 * { 'foo' : { 'bar' : { 'biz' : 'baz' }}}
 * It will then overlay the top hierarchy onto the bottom one.  This is useful
 * for configuring objects based upon a default configuration while allowing
 * the client to conveniently override these defaults as needed.
 *
 * @param top The top object hierarchy.
 * @param bottom The bottom, base object hierarchy.
 * @returns {Object|*} A new object representing the expanded top object
 * hierarchy overlaid on top of the expanded bottom object hierarchy.
 *
 */
dex.config.expandAndOverlay = function (top, bottom) {
  return dex.object.overlay(dex.config.expand(top), dex.config.expand(bottom));
};

/**
 *
 * Return the configuration for a font given the defaults and user
 * customizations.
 *
 * @param custom The user customizations.
 * @returns {Object|*}
 */
dex.config.font = function (custom) {
  var defaults =
  {
    'family'        : 'sans-serif',
    'size'          : 18,
    'weight'        : 'normal',
    'style'         : 'normal',
    'decoration'    : 'none',
    'wordSpacing'   : 'normal',
    'letterSpacing' : 'normal',
    'variant'       : 'normal'
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

/**
 *
 * @param node The node to be configured.
 * @param config The configuration. (family, size, weight, style,
 * decoration, wordSpacing, letterSpacing, variant)
 * @returns {*} The newly configured node.
 *
 */
dex.config.configureFont = function (node, config) {
  dex.config.setAttr(node, 'font-family', config.family);
  dex.config.setAttr(node, 'font-size', config.size);
  dex.config.setAttr(node, 'font-weight', config.weight);
  dex.config.setAttr(node, 'font-style', config.style);
  dex.config.setAttr(node, 'text-decoration', config.decoration);

  dex.config.setAttr(node, 'word-spacing', config.wordSpacing);
  dex.config.setAttr(node, 'letter-spacing', config.letterSpacing);
  dex.config.setAttr(node, 'variant', config.variant);

  //dex.config.setStyle(node, 'stroke-width', config.width);
  return node;
};

/**
 *
 * @param custom An object containing the caller's customizations.  Valid
 * customizations include: font, x, y, textLength, lengthAdjust, transform,
 * glyphOrientationVertical, text, dx, dy, writingMode, textAnchor, fill.
 *
 * @returns {Object|*} A text node with certain base defaults as well
 * as the caller's customizations applied.
 *
 */
dex.config.text = function (custom) {
  var defaults =
  {
    'font'                     : dex.config.font(),
    'x'                        : 0,
    'y'                        : 0,
    'textLength'               : undefined,
    'lengthAdjust'             : undefined,
    'transform'                : '',
    'glyphOrientationVertical' : undefined,
    'text'                     : undefined,
    'dx'                       : 0,
    'dy'                       : 0,
    'writingMode'              : undefined,
    'textAnchor'               : 'start',
    'fill'                     : dex.config.fill(),
    'format'                   : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

/**
 *
 * This routine will dynamically configure an SVG text entity based upon the
 * supplied configuration.
 *
 * @param node The SVG text node to be configured.
 * @param config The configuration to be applied. (x, y, dx, dy, anchor,
 * font, textLength, lengthAdjust, transform, glyphOrientationVertical,
 * writingMode, text).
 *
 * @returns {*} The fully configured text node.
 */
dex.config.configureText = function (node, config) {
  dex.config.setAttr(node, "x", config.x);
  dex.config.setAttr(node, "y", config.y);
  dex.config.setAttr(node, "dx", config.dx);
  dex.config.setAttr(node, "dy", config.dy);
  dex.config.setStyle(node, "text-anchor", config.anchor);
  dex.config.configureFont(node, config.font);
  dex.config.setAttr(node, 'textLength', config.textLength);
  dex.config.setAttr(node, 'lengthAdjust', config.lengthAdjust);
  dex.config.setAttr(node, 'transform', config.transform);
  dex.config.setAttr(node, 'glyph-orientation-vertical',
    config.glyphOrientationVertical);
  dex.config.setAttr(node, 'writing-mode', config.writingMode);
  dex.config.callIfDefined(node, 'text', config.text);
  dex.config.configureFill(node, config.fill);

  return node;
};

/**
 *
 * Return the configuration for a stroke.
 *
 * @param custom User customization. (width, color, opacity, dasharray)
 * @returns The stroke configuration.
 *
 */
dex.config.stroke = function (custom) {
  var defaults =
  {
    'width'     : 1,
    'color'     : "black",
    'opacity'   : 1,
    'dasharray' : '',
    'transform' : ''
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

/**
 *
 * Apply a stroke configuration to a node.
 *
 * @param node The node to be configured.
 * @param config The stroke configuration (width, color, opacity,
 * dasharray).
 * @returns The newly configured node.
 */
dex.config.configureStroke = function (node, config) {
  dex.config.setStyle(node, 'stroke-width', config.width);
  dex.config.setStyle(node, 'stroke', config.color);
  dex.config.setStyle(node, 'stroke-opacity', config.opacity);
  dex.config.setStyle(node, 'stroke-dasharray', config.dasharray);
  dex.config.setAttr(node, 'transform', config.transform);

  return node;
};

dex.config.fill = function (custom) {
  var defaults =
  {
    'fillColor'   : "grey",
    'fillOpacity' : 1
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureFill = function (node, config) {
  //dex.console.log("configureFill", node, config);
  dex.config.setAttr(node, 'fill', config.fillColor);
  dex.config.setAttr(node, 'fill-opacity', config.fillOpacity)
    .style("fill-opacity", config.fillOpacity);
  return node;
};

dex.config.link = function (custom) {
  var defaults =
  {
    'fill'      : dex.config.fill(),
    'stroke'    : dex.config.stroke(),
    'transform' : '',
    'd'         : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureLink = function (node, config) {
  dex.config.configureStroke(node, config.stroke);
  dex.config.configureFill(node, config.fill);
  dex.config.setAttr(node, 'transform', config.transform);
  dex.config.setAttr(node, 'd', config.d);

  return node;
}

dex.config.rectangle = function (custom) {
  var config =
  {
    'width'     : 50,
    'height'    : 50,
    'x'         : 0,
    'y'         : 0,
    'rx'        : 0,
    'ry'        : 0,
    'stroke'    : dex.config.stroke(),
    'opacity'   : 1,
    'color'     : d3.scale.category20(),
    'transform' : ''
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.configureRectangle = function (node, config) {
  dex.config.setAttr(node, 'width', config.width);
  dex.config.setAttr(node, 'height', config.height);
  dex.config.setAttr(node, 'x', config.x);
  dex.config.setAttr(node, 'y', config.y);
  dex.config.setAttr(node, 'rx', config.rx);
  dex.config.setAttr(node, 'ry', config.ry);
  dex.config.setAttr(node, 'opacity', config.opacity);
  dex.config.setAttr(node, 'fill', config.color);
  dex.config.setAttr(node, 'transform', config.transform);

  return node.call(dex.config.configureStroke, config.stroke);
};

dex.config.line = function (custom) {
  var defaults =
  {
    'start'  : dex.config.point(),
    'end'    : dex.config.point(),
    'stroke' : dex.config.stroke()
  };
  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureLine = function (node, config) {

  dex.config.setAttr(node, 'x1', config.start.x);
  dex.config.setAttr(node, 'y1', config.start.y);
  dex.config.setAttr(node, 'x2', config.end.x);
  dex.config.setAttr(node, 'y2', config.end.y);
  dex.config.configureStroke(node, config.stroke);

  return node;
};

dex.config.setAttr = function (node, name, value) {
  if (typeof value != 'undefined') {
    //dex.console.log("Set Attr: '" + name + "'='" + value + "'");
    node.attr(name, dex.config.optionValue(value));
  }
  else {
    //dex.console.log("Undefined Attr: '" + name + "'='" + value + "'");
  }
  return node;
};

dex.config.setStyle = function (node, name, value) {
  if (typeof value !== 'undefined') {
    //dex.console.log("Set Style: '" + name + "'='" + dex.config.optionValue(value) + "'");
    node.style(name, dex.config.optionValue(value));
  }
  else {
    //dex.console.log("Undefined Style: '" + name + "'='" + value + "'");
  }
  return node;
};

dex.config.optionValue = function (option) {
  return function (d, i) {
    //dex.console.log("OPTION", option);
    if (dex.object.isFunction(option)) {
      return option(d, i);
    }
    else {
      return option;
    }
  };
};

dex.config.callIfDefined = function (node, fn, value) {
//dex.console.log("TYPE", typeof value);
  if (typeof value === 'undefined') {
    //dex.console.log("Skipping: " + fn + "()");
  }
  else {
    //dex.console.log("Calling: '" + fn + "(" + value + ")");
    return node[fn](dex.config.optionValue(value));
  }

  return node;
};

dex.config.point = function (custom) {
  var config =
  {
    'x' : undefined,
    'y' : undefined
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.configurePoint = function (node, config) {
  return node
    .attr('x', config.center.cx)
    .attr('y', config.center.cy);
};

// Configures: opacity, color, stroke.
dex.config.configureShapeStyle = function (node, config) {
  return node
    .call(dex.config.configureStroke, config.stroke)
    .attr('opacity', config.opacity)
    .style('fill', config.color);
};

dex.config.circle = function (custom) {
  var config =
  {
    'cx'        : 0,
    'cy'        : 0,
    'r'         : 10,
    'fill'      : dex.config.fill(),
    'stroke'    : dex.config.stroke(),
    'transform' : '',
    'title'     : ''
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.configureCircle = function (node, config) {
  dex.config.setAttr(node, "r", config.r);
  dex.config.setAttr(node, "cx", config.cx);
  dex.config.setAttr(node, "cy", config.cy);
  dex.config.setAttr(node, "transform", config.transform);
  dex.config.setAttr(node, "title", config.title);
  node.call(dex.config.configureStroke, config.stroke);
  node.call(dex.config.configureFill, config.fill);

  return node;
};

dex.config.configureAxis_deprecate = function (config) {
  var axis = d3.svg.axis()
    .ticks(config.tick.count)
    .tickSubdivide(config.tick.subdivide)
    .tickSize(config.tick.size.major, config.tick.size.minor,
      config.tick.size.end)
    .tickPadding(config.tick.padding);

  // REM: Horrible way of doing this.  Need a function which
  // is more generic and smarter to short circuit stuff like
  // this.  But...for now it does what I want.
  if (!dex.object.isFunction(config.tick.format)) {
    axis.tickFormat(config.tick.format);
  }

  axis
    .orient(config.orient)
    .scale(config.scale);

  //axis.scale = config.scale;
  return axis;
};

dex.config.tick_deprecate = function (custom) {
  var config =
  {
    'count'     : 5,
    //'tickValues'  : undefined,
    'subdivide' : 3,
    'size'      : {
      'major' : 5,
      'minor' : 3,
      'end'   : 5
    },
    'padding'   : 5,
    'format'    : d3.format(",d"),
    'label'     : dex.config.text()
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.xaxis_deprecate = function (custom) {
  var config =
  {
    'scale'  : d3.scale.linear(),
    'orient' : "bottom",
    'tick'   : this.tick(),
    'label'  : dex.config.text()
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.yaxis_deprecate = function (custom) {
  var config =
  {
    'scale'  : d3.scale.linear(),
    'orient' : 'left',
    'tick'   : this.tick(),
    'label'  : dex.config.text({'transform' : 'rotate(-90)'})
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.callConditionally = function (fn, value) {
  if (typeof value !== 'undefined') {
    //dex.console.log("- FN:" + fn);
    //dex.console.log("- VALUE:" + value);
    //dex.console.log("- CALLING...");
    fn(value);
  }
  else {
//    dex.console.log("- FN:" + fn);
//    dex.console.log("- VALUE:" + value);
//    dex.console.log("- NOT CALLING...");
  }
}

dex.config.axis = function (custom) {
  var defaults =
  {
    'scale'         : undefined,
    'orient'        : 'bottom',
    'ticks'         : undefined,
    'tickValues'    : undefined,
    'tickSize'      : undefined,
    'innerTickSize' : undefined,
    'outerTickSize' : undefined,
    'tickPadding'   : undefined,
    'tickFormat'    : undefined,
    'tickSubdivide' : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureAxis = function (axis, config) {
  [
    'scale',
    'orient',
    'ticks',
    'tickValues',
    'tickSize',
    'innerTickSize',
    'outerTickSize',
    'tickPadding',
    'tickFormat',
    'tickSubdivide'
  ].forEach(function (fn) {
      //dex.console.log("Calling: " + fn);
      dex.config.callConditionally(axis[fn], config[fn]);
    });

  return axis;
};

dex.config.scale = function (custom) {
  var fmap =
  {
    'linear'   : dex.config.linearScale,
    'sqrt'     : dex.config.sqrtScale,
    'pow'      : dex.config.powScale,
    'time'     : dex.config.timeScale,
    'log'      : dex.config.logScale,
    'ordinal'  : dex.config.ordinalScale,
    'quantile' : dex.config.quantileScale,
    'quantize' : dex.config.quantizeScale,
    'identity' : dex.config.identityScale,
    'ordinal'  : dex.config.ordinalScale
  };

  var defaults =
  {
    'type' : 'linear'
  };

  var config = dex.config.expandAndOverlay(custom, defaults);

  return fmap[config.type](config);
}

dex.config.createScale = function (config) {
  var scale;
  var fmap =
  {
    'linear'   : d3.scale.linear,
    'sqrt'     : d3.scale.sqrt,
    'pow'      : d3.scale.pow,
    'time'     : d3.time.scale,
    'log'      : d3.scale.log,
    'ordinal'  : d3.scale.ordinal,
    'quantile' : d3.scale.quantile,
    'quantize' : d3.scale.quantize,
    'identity' : d3.scale.identity,
    'ordinal'  : d3.scale.ordinal
  };

  scale = fmap[config.type]();

  dex.config.configureScale(scale, config);
  return scale;
}

dex.config.linearScale = function (custom) {
  var defaults =
  {
    'type'        : 'linear',
    'domain'      : [0, 100],
    'range'       : [0, 800],
    'rangeRound'  : undefined,
    'interpolate' : undefined,
    'clamp'       : undefined,
    'nice'        : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.powScale = function (custom) {
  var defaults =
  {
    'type'        : 'pow',
    'domain'      : [0, 100],
    'range'       : [0, 800],
    'rangeRound'  : undefined,
    'interpolate' : undefined,
    'clamp'       : undefined,
    'nice'        : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.sqrtScale = function (custom) {
  var defaults =
  {
    'type'        : 'sqrt',
    'domain'      : [0, 100],
    'range'       : [0, 800],
    'rangeRound'  : undefined,
    'interpolate' : undefined,
    'clamp'       : undefined,
    'nice'        : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.logScale = function (custom) {
  var defaults =
  {
    'type'        : 'log',
    'domain'      : [0, 100],
    'range'       : [0, 800],
    'rangeRound'  : undefined,
    'interpolate' : undefined,
    'clamp'       : undefined,
    'nice'        : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.ordinalScale = function (custom) {
  var defaults =
  {
    'type'            : 'ordinal',
    'domain'          : undefined,
    'range'           : undefined,
    'rangeRoundBands' : undefined,
    'rangePoints'     : undefined,
    'rangeBands'      : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.timeScale = function (custom) {
  var defaults =
  {
    'type'        : 'time',
    'domain'      : undefined,
    'range'       : undefined,
    'rangeRound'  : undefined,
    'interpolate' : undefined,
    'clamp'       : undefined,
    'ticks'       : undefined,
    'tickFormat'  : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.quantileScale = function (custom) {
  var defaults =
  {
    'type'   : 'quantile',
    'domain' : undefined,
    'range'  : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.quantizeScale = function (custom) {
  var defaults =
  {
    'type'   : 'quantize',
    'domain' : undefined,
    'range'  : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.identityScale = function (custom) {
  var defaults =
  {
    'type'   : 'identity',
    'domain' : undefined,
    'range'  : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.thresholdScale = function (custom) {
  var defaults =
  {
    'type'   : 'threshold',
    'domain' : undefined,
    'range'  : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureScale = function (scale, config) {
  for (var property in config) {
    if (config.hasOwnProperty(property) && property !== 'type') {
      //dex.console.log("Property: '" + property + "'");
      dex.config.callConditionally(scale[property], config[property]);
    }
  }

  return scale;
};