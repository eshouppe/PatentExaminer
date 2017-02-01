/**
 * Created by ryancarlton on 1/20/17.
 */
(function (window, Backbone, Handlebars, Templates) {
  window.app.chartView = Backbone.View.extend({
    template: '',
    el: '.chartView',
    initialize: function (searchObj) {
      this.seq = 0;
      this.resetFnc = null;
      this.searchObj = searchObj;
      this.template = Templates.chartView(searchObj);
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

      var defaultTooltipOptions = {
        currency: undefined, //accepts '£', '$', '€', etc.
        //e.g. 4000 => €4,000
        tooltipFnc: function(pointMeta){
          var metaObj = pointMeta.split(':');
          return 'USPat: ' + metaObj[0].substring(0,10) + ' <br> ' + metaObj[1] + '<br> (click point to save patent)';
        }, //accepts function
        //build custom tooltip
        transformTooltipTextFnc:null, // accepts function
        // transform tooltip text
        class: 'tooltipListenerClass', // accecpts 'class1', 'class1 class2', etc.
        //adds class(es) to tooltip wrapper
        anchorToPoint: false,  //accepts true or false
        //tooltips do not follow mouse movement -- they are anchored to the point / bar.
        appendToBody: false,  //accepts true or false
        //appends tooltips to body instead of chart container
        'tooltipOffset': {
          'y': -30
        }
      };
      var options = {
        showLine: false,
        axisX: {
          showGrid: true,
          showLabel: false,
          type: Chartist.AutoScaleAxis,
          scaleMinSpace: 30,
          divisor: 5
          // highLow: {
          //   high: 150,
          //   low: -25
          // },
          // high: 150,
          // low: -25
          // labelInterpolationFnc: function (value, index) {
          //   return index % 13 === 0 ? 'x' + value : null;
          // }
        },
        axisY: {
          showGrid: true,
          showLabel: false,
          type: Chartist.AutoScaleAxis,
          scaleMinSpace: 40,
          divisor: 5
          // highLow: {
          //   high: 150,
          //   low: -25
          // },
          // high: 150,
          // low: -25
        },
        plugins: [
          Chartist.plugins.tooltip(defaultTooltipOptions),
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
          doc.meta = '' + doc.patent_number + ':' + doc.patent_title;
          newData.series[doc.series].push(doc);
        }
      }
      //Compute and Add Circles
      newData.series.unshift(data.circles  || []);
      this.test = 0;
      this.seq = 0;

      this.chart.update(newData);
    },
    onDrawUpdates: function (data) {
      if (data.type !== 'grid' && data.seriesIndex === 0) {
        this.createVennCirclesOnGraph(data);
      }
      //this.animatePoints(data);
    },
    onZoom: function (chart, reset) {
      this.seq = 0;
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
    createVennCirclesOnGraph: function (currentGraphData) {
      var rangeX = this.chart.options.axisX.highLow || Chartist.getHighLow(this.chart.data.series.slice(1), this.chart.optionsProvider.getCurrentOptions(), 'x');
      var rangeY = this.chart.options.axisY.highLow || Chartist.getHighLow(this.chart.data.series.slice(1), this.chart.optionsProvider.getCurrentOptions(), 'y');
      var startingRadius = currentGraphData.series[currentGraphData.index].r;
      var diagonal = (Math.sqrt(Math.pow($('#resultsChart svg').height(), 2) + Math.pow($('#resultsChart svg').width(), 2)) || 1);
      var bound = {range: (Math.sqrt(Math.pow((rangeX.high - rangeX.low) || 1, 2) + Math.pow((rangeY.high - rangeY.low) || 1, 2)) || 1)};
      var newRadius = Chartist.projectLength(diagonal, startingRadius, bound);

      var circ1 = new Chartist.Svg("circle");
      var text1 = new Chartist.Svg("text");
      circ1.attr({
        "class": "specialCircle specialCircle" + (currentGraphData.index + 1),
        cx: currentGraphData.x,
        cy: currentGraphData.y,
        r: newRadius
      });
      text1.attr({
        "class": "specialText specialText" + (currentGraphData.index + 1),
        x: currentGraphData.x + newRadius + 10,
        y: currentGraphData.y
      });
      switch (currentGraphData.index) {
        case 0:
          text1._node.innerHTML = this.searchObj['searchText'];
          break;
       default:
          text1._node.innerHTML = this.searchObj['s'+currentGraphData.index];
          break;
      }
      currentGraphData.group.append(circ1);
      currentGraphData.group.append(text1);
    },
    //Temp functions to calc circles:
    // createCircles: function (series) {
    //   var allSeriesCircles = [];
    //   var seriesAverages = this.avgOfXandY(series);
    //   for (var currentSeries in series) {
    //     var plottedSeries = series[currentSeries];
    //     var seriesCenterOfMass = seriesAverages[currentSeries];
    //     allSeriesCircles.push({
    //       'x': seriesCenterOfMass.x,
    //       'y': seriesCenterOfMass.y,
    //       'r': this.computeCircleRadius(plottedSeries, seriesCenterOfMass)
    //     });
    //   }
    //   return allSeriesCircles;
    // },
    // avgOfXandY: function (arrayToWorkOn) {
    //   var sumX = 0,
    //     sumY = 0,
    //     count = 0,
    //     seriesAvg = [];
    //   for (var x in arrayToWorkOn) {
    //     currentArray = arrayToWorkOn[x];
    //     count = currentArray.length;
    //     for (var dataPoint in currentArray) {
    //       dataPoint = currentArray[dataPoint];
    //       sumX += dataPoint['x'];
    //       sumY += dataPoint['y'];
    //     }
    //     seriesAvg.push({
    //       'x': sumX / (count || 1),
    //       'y': sumY / (count || 1)
    //     });
    //     sumX = 0;
    //     sumY = 0;
    //     count = 0;
    //   }
    //   return seriesAvg;
    // },
    // computeCircleRadius: function (arrayOfPoints, center) {
    //   var cX = center.x,
    //     cY = center.y,
    //     distancesFromCenter = [];
    //   for (var currentPoint in arrayOfPoints) {
    //     currentPoint = arrayOfPoints[currentPoint];
    //     distancesFromCenter.push(this.calcDistanceBetweenPoints(cX, cY, currentPoint.x, currentPoint.y))
    //   }
    //   var sum = distancesFromCenter.reduce(function (a, b) {
    //     return a + b;
    //   });
    //   var avg = sum / (distancesFromCenter.length || 1);
    //   return avg;
    // },
    // calcDistanceBetweenPoints: function (x1, y1, x2, y2) {
    //   var distX = Math.pow((x2 - x1), 2);
    //   var distY = Math.pow((y2 - y1), 2);
    //   return Math.sqrt(distX + distY);
    // }
  });
})(window, Backbone, Handlebars, Templates);
