/**
 * Created by ryancarlton on 1/20/17.
 */
 (function (window, Backbone, Handlebars, Templates) {
   window.app.apiView = Backbone.View.extend({
    template: '',
    el:'#appView',
    initialize: function () {
      var tempData = {
        searchedTerms:window.app.data.searchedTerms,
        docFound:window.app.data.docsFound
      };
      this.template = Templates.apiView(tempData);
      this.render();
    },
    render: function () {
      this.$el.html(this.template);
      window.app.changePageTitle('Api Results')
    }
  });
})(window, Backbone, Handlebars, Templates);
