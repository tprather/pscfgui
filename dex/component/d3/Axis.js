/**
 *
 * @param userConfig A user supplied configuration object which will override the defaults.
 * @returns {DexComponent} Returns the Axis object.
 * @constructor
 *
 */
function Axis(userConfig) {
  var defaults =
  {
    // The parent container of this chart.
    'parent'    : null,
    // Set these when you need to CSS style components independently.
    'id'        : 'Axis',
    'class'     : 'Axis',
    // Our data...
    'csv'       : {
      'header' : [ "X", "Y" ],
      'data'   : [
        [0, 0],
        [1, 1],
        [2, 4],
        [3, 9],
        [4, 16]
      ]
    },
    'transform' : '',
    'column'    : 0,
    'axis'      : dex.config.axis({
      'type'   : 'linear',
      'orient' : 'bottom'
    }),
    'title'     : dex.config.text({'text' : 'axis'})
  };

  var config = dex.config.expandAndOverlay(userConfig, defaults);

  var chart = new DexComponent(userConfig, defaults);

  // Replace the scale configuration with a real scale.
  var scale = dex.config.createScale(dex.config.scale(chart.config.axis.scale));
  chart.config.axis.scale = scale;

  chart.render = function () {
    this.update();
  };

  chart.update = function () {
    var chart = this;
    var config = chart.config;
    var chartContainer = d3.select(config.parent).append("g")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr("transform", config.transform);

    var axis = d3.svg.axis();

    dex.config.configureAxis(axis, config.axis);
    chartContainer.call(axis);

    chartContainer.append("text")
      .call(dex.config.configureText, config.title);
  };

  return chart;
}