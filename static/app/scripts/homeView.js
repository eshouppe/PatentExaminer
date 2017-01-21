/**
 * Created by ryancarlton on 1/20/17.
 */

window.app.homeView = (function (window, Backbone) {
  return Backbone.View.extend({
    template: '<p>hello from the home view</p>',
    // id:'app-homeview',
    el:'#homeView',
    initialize: function () {
      this.render();
    },
    render: function () {
      this.$el.html(this.template);
    }
  });
})(window, Backbone);
