/**
 * Created by ryancarlton on 1/25/17.
 */
(function (window, Backbone, Handlebars, Templates) {
    window.app.workBenchView = Backbone.View.extend({
        template: '<span>workBenchView view</span>',
        el: '#appView',
        initialize: function () {
            this.template = Templates.workBenchView();
            this.render();
        },
        render: function () {
            this.$el.html(this.template);
        }
    });
})(window, Backbone, Handlebars, Templates);
