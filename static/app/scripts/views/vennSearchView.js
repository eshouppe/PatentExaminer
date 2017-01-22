/**
 * Created by ryancarlton on 1/22/17.
 */
(function (window, Backbone, Handlebars, Templates) {
  window.app.vennSearchView = Backbone.View.extend({
    template: '<span>vennSearchView view</span>',
    el: '#appView',
    class: 'vennSearchView',
    viewState:{primarysearch:true},
    viewTitle:'New Primary Search',
    events: {
      'click .vennSearchView .searchnow':'primarySearch'
    },
    initialize: function () {
      //Reup the state if need be

      this.render();
    },
    render: function () {
      this.template = Templates.vennSearchView(this.viewState);
      this.changePageTitle(this.viewTitle);
      this.$el.html(this.template);
      //required after adding new material items
      componentHandler.upgradeDom();
    },
    primarySearch: function () {
      //Setup Primary search logic here
      this.viewState = {primaryresults:true};
      this.viewTitle='Primary Results';
      this.render();
    },
    changePageTitle: function (newtitle) {
      window.app.changePageTitle(newtitle);
    }
  });
})(window, Backbone, Handlebars, Templates);
