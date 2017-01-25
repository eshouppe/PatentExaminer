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
          scaleMinSpace: 30,
          divisor: 5,
          low: 0
          // labelInterpolationFnc: function (value, index) {
          //   return index % 13 === 0 ? 'x' + value : null;
          // }
        },
        axisY: {
          showGrid: true,
          showLabel: false,
          type: Chartist.AutoScaleAxis,
          scaleMinSpace: 40,
          divisor: 5,
          low: 0
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
      //Compute and Add Circles
      newData.series.unshift(this.createCircles(newData.series));
      this.test = 0;
      this.seq = 0;
      this

      this.chart.update(newData);
    },
    onDrawUpdates: function (data) {
      if (data.type !== 'grid' && data.seriesIndex === 0) {
        this.createVennCirclesOnGraph(data);
      }
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

    },

    createVennCirclesOnGraph: function (currentGraphData) {
      var startingRadius = currentGraphData.series[currentGraphData.index].r;
      var diagonal = (Math.sqrt(Math.pow($('#resultsChart svg').height(), 2) + Math.pow($('#resultsChart svg').width(), 2)) || 1);
      var rangeX = Chartist.getHighLow(this.chart.data.series.slice(1), this.chart.optionsProvider.getCurrentOptions(), 'x');
      var rangeY = Chartist.getHighLow(this.chart.data.series.slice(1), this.chart.optionsProvider.getCurrentOptions(), 'y');
      var bound = {range:(Math.sqrt(Math.pow((rangeX.high - rangeX.low) || 1, 2) + Math.pow((rangeY.high - rangeY.low) || 1, 2)) || 1)};

      //in this case range is the same for both axis...if not find the average of the two?
      var newRadius = Chartist.projectLength(diagonal, startingRadius, bound);

      var circ1 = new Chartist.Svg("circle");
      circ1.attr({
        "class": "specialCircle",
        cx: currentGraphData.x,
        cy: currentGraphData.y,
        r: newRadius
      });
      currentGraphData.group.append(circ1);
    },

    createCircles: function (series) {
      var allSeriesCircles = [];
      var seriesAverages = this.avgOfXandY(series);
      for (var currentSeries in series) {
        var plottedSeries = series[currentSeries];
        var seriesCenterOfMass = seriesAverages[currentSeries];
        allSeriesCircles.push({
          'x': seriesCenterOfMass.x,
          'y': seriesCenterOfMass.y,
          'r': this.computeCircleRadius(plottedSeries, seriesCenterOfMass)
        });
      }
      return allSeriesCircles;
    },

    avgOfXandY: function (arrayToWorkOn) {
      var sumX = 0,
        sumY = 0,
        count = 0,
        seriesAvg = [];
      for (var x in arrayToWorkOn) {
        currentArray = arrayToWorkOn[x];
        count = currentArray.length;
        for (var dataPoint in currentArray) {
          dataPoint = currentArray[dataPoint];
          sumX += dataPoint['x'];
          sumY += dataPoint['y'];
        }
        seriesAvg.push({
          'x': sumX / (count || 1),
          'y': sumY / (count || 1)
        });
        sumX = 0;
        sumY = 0;
        count = 0;
      }
      return seriesAvg;
    },

    computeCircleRadius: function (arrayOfPoints, center) {
      var cX = center.x,
        cY = center.y,
        distancesFromCenter = [];
      for (var currentPoint in arrayOfPoints) {
        currentPoint = arrayOfPoints[currentPoint];
        distancesFromCenter.push(this.calcDistanceBetweenPoints(cX, cY, currentPoint.x, currentPoint.y))
      }
      var sum = distancesFromCenter.reduce(function(a, b) { return a + b; });
      var avg = sum / (distancesFromCenter.length || 1);
      return avg;
    },

    calcDistanceBetweenPoints: function (x1, y1, x2, y2) {
      var distX = Math.pow((x2 - x1), 2);
      var distY = Math.pow((y2 - y1), 2);
      return Math.sqrt(distX + distY);
    }
  });
})(window, Backbone, Handlebars, Templates);
