/**
 * Created by ryancarlton on 1/20/17.
 */
window.app.apiView = (function (window, Backbone, Handlebars, Templates) {
  return Backbone.View.extend({
    template: Templates.apiView(),
    id:'app-apiview',
    el:'#apiView',
    initialize: function () {
      //var theTemplateScript = $("#example-template").html();
      //debugger;
      // Compile the template
      //this.template = Handlebars.compile(theTemplateScript);

      this.render();
    },
    render: function () {
      this.$el.html(this.template);
    }
  });
})(window, Backbone, Handlebars, Templates);
