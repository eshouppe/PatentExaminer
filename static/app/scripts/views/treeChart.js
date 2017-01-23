/**
 * Created by ryancarlton on 1/22/17.
 */
(function (window, Backbone, Handlebars, Templates) {
  window.app.treeChart = Backbone.View.extend({
    template: '<div id="treeChart"></div>',
    el: '#treeChartView',
    initialize: function () {
      //this.template = Templates.treeChart();
      this.render();
      this.renderTreeChart();
    },
    render: function () {
      this.$el.html(this.template);
    },
    renderTreeChart: function () {
      var treeData =
        {
          "name": "Cannon",

          "children": [
            {"name": "Ball"},
            {"name": "Steel"},
            {"name": "Carbon"},
            {"name":"Powder"},
            {"name":"Ship"},
            {"name":"Wood"},
            {"name":"Parrot"},
            {
              "name":"Pirate",
              "children":[
                {"name":"Barbosa"},
                {"name":"Jack"}
              ]
            }
          ]
        };

      // set the dimensions and margins of the diagram
      var margin = {top: 20, right: 90, bottom: 30, left: 90},
        //width = '100%',
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // declares a tree layout and assigns the size
      var treemap = d3.tree()
        .size([height, width]);

    //  assigns the data to a hierarchy using parent-child relationships
      var nodes = d3.hierarchy(treeData, function (d) {
        return d.children;
      });

    // maps the node data to the tree layout
      nodes = treemap(nodes);

      // append the svg object to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      var svg = d3.select("#treeChart").append("svg")
          .attr("width", "100%")
          .attr("height", height + margin.top + margin.bottom)
          .attr("viewBox","0 0 960 650")
          .attr("preserveAspectRatio","xMidYMid meet");
        g = svg.append("g")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

      // adds the links between the nodes
      var link = g.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function (d) {
          return "M" + d.y + "," + d.x
            + "C" + (d.y + d.parent.y) / 2 + "," + d.x
            + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
            + " " + d.parent.y + "," + d.parent.x;
        });

      // adds each node as a group
      var node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("data-topic", function(d){return '' + d.data.name;})
        .attr("class", function (d) {
          return "node topic" +
            (d.children ? " node--internal" : " node--leaf");
        })
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

      // adds the circle to the node
      node.append("circle")
        .attr("r", 10);

      // adds the text to the node
      node.append("text")
        .attr("dy", ".35em")
        .attr("x", function (d) {
          return d.children ? -13 : 13;
        })
        .style("text-anchor", function (d) {
          return d.children ? "end" : "start";
        })
        .text(function (d) {
          return d.data.name;
        });
    }
  });
})(window, Backbone, Handlebars, Templates);
