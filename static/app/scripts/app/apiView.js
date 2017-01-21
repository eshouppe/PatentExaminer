/**
 * Created by ryancarlton on 1/20/17.
 */
window.app.apiView = (function (window, Backbone) {
  return Backbone.View.extend({
    template: '<p>hello from the api view</p>',
    id:'app-apiview',
    el:'#apiView',
    initialize: function () {
      this.render();
    },
    render: function () {
      this.$el.html(this.template);
    }
  });
})(window, Backbone);
