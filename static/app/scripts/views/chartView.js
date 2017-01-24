/**
 * Created by ryancarlton on 1/20/17.
 */
(function (window, Backbone, Handlebars, Templates) {
  window.app.chartView = Backbone.View.extend({
    template: '',
    el: '.chartView',
    initialize: function () {
      this.test = 2;
      this.seq = 0;
      this.circle1 = {};
      this.circle2 = {};

      this.resetFnc = null;
      this.template = Templates.chartView();
      this.render();
      this.buildInitialChart();
    },
    render: function () {
      this.$el.html(this.template);
    },
    buildInitialChart: function () {
      var data = {
        series: []
      };
      var options = {
        showLine: false,
        axisX: {
          showGrid: true,
          showLabel: false,
          type: Chartist.AutoScaleAxis,
          // labelInterpolationFnc: function (value, index) {
          //   return index % 13 === 0 ? 'x' + value : null;
          // }
        },
        axisY: {
          showGrid: true,
          showLabel: false,
          type: Chartist.AutoScaleAxis,
        },
        plugins: [
          Chartist.plugins.tooltip(),
          // Chartist.plugins.ctPointLabels({
          //   textAnchor: 'middle'
          // }),
          Chartist.plugins.zoom({onZoom: this.onZoom.bind(this)})
        ]
      };

      var responsiveOptions = [
        ['screen and (min-width: 640px)', {
          axisX: {
            labelInterpolationFnc: function (value, index) {
              return index % 4 === 0 ? 'W' + value : null;
            }
          }
        }]
      ];
      this.chart = new Chartist.Line('#resultsChart', data, options, responsiveOptions).on('draw', this.onDrawUpdates.bind(this));
    },
    drawGraph: function (data) {
      var newData = {
        series: [
          [],
          [],
          [],
          []
        ]
      };
      if (data.resultsToPlot) {
        for (var idx in data.resultsToPlot) {
          var doc = data.resultsToPlot[idx];
          doc.meta = 'Pat Num:' + doc.patent_ID;
          newData.series[doc.series - 1].push(doc);
        }
      }
      this.circle1 = data.search1Circle || {};
      this.circle2 = data.search2Circle || {};
      this.test = 0;
      this.seq = 0;

      this.chart.update(newData);
    },
    onDrawUpdates: function (data) {
      //this.animatePoints(data);
      //this.addCircles(data);
    },
    onZoom: function (chart, reset) {
      this.seq = 0;
      this.test = 0;
      this.resetFnc = reset;
      this.chart.update();
    },
    resetZoom: function () {
      this.resetFnc && this.resetFnc();
    },
    animatePoints: function (data) {
      //todo: data.element.addClass('test')
      //only add teh class on the last object item
      if (data.type === 'point') {
        // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
        data.element.animate({
          opacity: {
            // The delay when we like to start the animation
            begin: this.seq++ * 80,
            // Duration of the animation
            dur: 50,
            // The value where the animation should start
            from: 0,
            // The value where it should end
            to: 1
          },
          x1: {
            begin: this.seq++ * 80,
            dur: 50,
            from: data.x - 100,
            to: data.x,
            // You can specify an easing function name or use easing functions from Chartist.Svg.Easing directly
            easing: Chartist.Svg.Easing.easeOutQuart
          }
        });
      }
    },
    addCircles: function (data) {
      if (data.type === 'grid' && data.index === 0 && this.test === 0) {
        this.test += 1;
        // create a custom label element to insert into the bar
        var label = new Chartist.Svg("circle");
        this.circle1.x = data.axis.axisLength * (Chartist.getMultiValue(this.circle1.x, 'x') - data.axis.range.min) / (data.axis.range.max - data.axis.range.min);
        this.circle2.x = data.axis.axisLength * (Chartist.getMultiValue(this.circle2.x, 'x') - data.axis.range.min) / (data.axis.range.max - data.axis.range.min);
        this.circle1.r = (this.circle1.r * this.circle1.x);
        this.circle2.r = (this.circle2.r * this.circle2.x);
      }
      // if (data.type === 'grid' && data.index === 1 && test === 1 && ) {
      if (data.type === 'grid' && data.index === 0 && this.test === 1) {
        this.test += 1;
        this.circle1.y = data.axis.axisLength * (Chartist.getMultiValue(this.circle1.y, 'y') - data.axis.range.min) / (data.axis.range.max - data.axis.range.min);
        this.circle2.y = data.axis.axisLength * (Chartist.getMultiValue(this.circle2.y, 'y') - data.axis.range.min) / (data.axis.range.max - data.axis.range.min);
      }
      if (data.type === 'point' && data.index === 0 && this.test === 2) {
        this.test += 1;
        var circ1 = new Chartist.Svg("circle");
        var circ2 = new Chartist.Svg("circle");
        //this.circle1.r = (this.circle1.r * this.circle1.x)/(this.circle1.r * this.circle1.y);
        //this.circle2.r = (this.circle2.r * this.circle2.x)/(this.circle2.r * this.circle2.y);

        circ1.attr({
          cx: this.circle1.y,
          cy: this.circle1.x,
          r: [this.circle1.r],
          "class": "vennCircle1"
        });
        circ2.attr({
          cx: this.circle2.y,
          cy: this.circle2.x,
          r: [this.circle2.r],
          "class": "vennCircle2"
        });
        // add the new custom text label to the bar
        data.group.append(circ1);
        data.group.append(circ2);
      }

    }
  });
})(window, Backbone, Handlebars, Templates);
