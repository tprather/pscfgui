function VerticalLegend(userConfig)
{
  var defaults = {
    'labels'          : [ "A", "B", "C" ],
    'id'              : "VerticalLegend",
    'class'           : "VerticalLegend",
    'parent'          : null,
    'height'          : 400,
    'width'           : 200,
    'xoffset'         : 50,
    'yoffset'         : 30,
    'cellWidth'       : 30,
    'cellHeight'      : 20,
    'tickLength'      : 5,
    'caption'         : "Legend",
    'captionFontSize' : 14,
    'captionXOffset'  : -30,
    'captionYOffset'  : -20,
    'cell'            :
    {
      'rect'  : dex.config.rectangle(),
      'label' : dex.config.text()
    },
    'title'          :
      dex.config.text(
        {
          'text' : 'Legend',
          'dy'   : -10,
          'x'    : 42
        })
  };

  var config = dex.object.overlay(dex.config.expand(userConfig), dex.config.expand(defaults));

  // Things defined in terms of the defaults:
  var chart = new DexComponent(userConfig, defaults);

  chart.render = function()
  {
    this.update();
  };

  chart.update = function()
  {
    var chart = this;
    var config = this.config;

    var y = d3.scale.ordinal()
      .domain(config.labels)
      .rangeBands([0, config.height]);

  // Append a graphics node to the supplied svg node.
  var chartContainer = d3.select(config.parent).append("g")
    .attr("id", config["id"])
    .attr("class", config["class"])
    .attr("transform",
      "translate(" + config.xoffset + "," + config.yoffset + ")");

  var rects = chartContainer.selectAll("rect")
    .data(config.labels)
    .enter().append("rect")
    .call(dex.config.configureRectangle, config.cell.rect)
    //.attr("height", 12)
    .attr("y", function(d) { return y(d); })
    //.attr("width", 20)
    .style("fill", function(d)
    {
      return config.cell.rect.color(d);
    })
    .on("mouseover", function(d)
    {
       chart.notify({"type":"mouseover","d":d});
    })
    .on("mouseout", function(d)
    {
       chart.notify({"type":"mouseout","d":d});
    })
    .on("mousedown", function(d)
    {
       chart.notify({"type":"mousedown","d":d});
    });

  chartContainer.selectAll("label")
    .data(config.labels)
    .enter().append("text")
    .call(dex.config.configureText, config.cell.label)
    .attr("y", function(d) { return y(d); })
    .text(function(d) { return d;});
    
  chartContainer.append("text")
    .call(dex.config.configureText, config.title)
    .text(config.title.text);
  };
  
  return chart;
}
