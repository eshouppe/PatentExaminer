/**
 * Created by ryancarlton on 1/20/17.
 */
 (function (window, Backbone, Handlebars, Templates) {
   window.app.apiView = Backbone.View.extend({
    template: Templates.apiView(),
    el:'#apiView',
    initialize: function () {
      this.render();
    },
    render: function () {
      this.$el.html(this.template);
    }
  });
})(window, Backbone, Handlebars, Templates);
