/**
 * Created by ryancarlton on 1/20/17.
 */
(function (window, Backbone, Handlebars, Templates) {
  window.app.chartView = Backbone.View.extend({
    template: '',
    el:'.chartView',
    initialize: function () {
      this.template = Templates.chartView();
      this.render();
    },
    render: function () {
      this.$el.html(this.template);
    }
  });
})(window, Backbone, Handlebars, Templates);
