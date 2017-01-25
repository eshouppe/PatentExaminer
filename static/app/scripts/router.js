/**
 * Created by ryancarlton on 1/20/17.
 */
window.app.router = (function (window, Backbone) {
  return Backbone.Router.extend({
    view: null,

    routes: {
      "api":"api",
      "workBench":"workBench",
      "*actions":"vennSearch",    // #help
    },
    api: function () {
      if (window.CONFIG && window.CONFIG.debug) {
        this.destroyCurrentView();
        this.loadNewView(window.app.apiView);
      } else {
        window.location.href = '/';
      }
    },
    vennSearch: function () {
      this.destroyCurrentView();
      this.loadNewView(window.app.vennSearchView);
    },
    workBench: function () {
      this.destroyCurrentView();
      this.loadNewView(window.app.workBenchView);
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
          $('.appContainer').append('<div id="appView"></div>')
        }
      }
    }
  });
})(window, Backbone);
