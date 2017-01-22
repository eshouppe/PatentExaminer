/**
 * Created by ryancarlton on 1/20/17.
 */
window.app.router = (function (window, Backbone) {
  return Backbone.Router.extend({
    view: null,

    routes: {
      "api":"api",
      "*actions":"home",    // #help
    },

    home: function() {
      this.destroyCurrentView();
      this.loadNewView(window.app.homeView)
    },
    api: function () {
      this.destroyCurrentView();
      this.loadNewView(window.app.apiView)
    },

    //View Functions
    loadNewView: function(newView) {
      this.view = new newView();
    },
    destroyCurrentView: function () {
      if (this.view) {
        this.view.undelegateEvents();
        $(this.view.el).removeData().unbind();
        Backbone.View.prototype.remove.call(this.view);
        if ($('#appView').length == 0) {
          $('.appContainer').prepend('<div id="appView"></div>')
        }
      }
    }
  });
})(window, Backbone);
