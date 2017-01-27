/**
 * Created by ryancarlton on 1/25/17.
 */
(function (window, Backbone, Handlebars, Templates) {
  window.app.workBenchView = Backbone.View.extend({
    template: '<span>workBenchView view</span>',
    el: '#appView',
    class: 'workbench',
    initialize: function () {
      var templateDataFromStorage = window.app.localDataManager(true, 'searchData');

      this.template = Templates.workBenchView(templateDataFromStorage);
      this.render();
    },
    render: function () {
      this.$el.html(this.template);
    }
  });
})(window, Backbone, Handlebars, Templates);
