/**
 * Created by ryancarlton on 1/25/17.
 */
(function (window, Backbone, Handlebars, Templates) {
  window.app.workBenchView = Backbone.View.extend({
    template: '<span>workBenchView view</span>',
    el: '#appView',
    events:{
      'click .workBenchView .removeSearch':'removeSearch',
      'click .workBenchView .removeSavedPatent':'removePatent'
    },
    initialize: function () {
      this.templateDataFromStorage = window.app.localDataManager(true, 'searchData');
      this.render();
    },
    render: function () {
      // exampleData = {
      //   'savedPatents':[
      //     {
      //       'patentId':'1234',
      //       'patentTitle':'testing'
      //     }
      //   ],
      //   'previousSearch': [
      //     {
      //       'searchId':'1234',
      //       'searchText':'testing'
      //     }
      //   ]
      // };

      this.template = Templates.workBenchView(this.templateDataFromStorage);
      this.$el.html(this.template);
    },
    removePatent: function (event) {
      var searchIdx = $(event.currentTarget).data('idx');
      function filterByIndex(elm,idx) {
        return (idx !== searchIdx);
      }
      this.templateDataFromStorage.savedPatents = this.templateDataFromStorage.savedPatents.filter(filterByIndex);
      window.app.localDataManager(false,'searchData',this.templateDataFromStorage);
      this.render();
    },
    removeSearch: function (event) {
      var searchIdx = $(event.currentTarget).data('idx');
      function filterByIndex(elm,idx) {
        return (idx !== searchIdx);
      }
      // this.templateDataFromStorage.savedPatents = [
      //   {
      //     'patentId':'1234',
      //     'patentTitle':'testing a patent'
      //   },
      //   {
      //     'patentId':'9988',
      //     'patentTitle':'Hi I am a patent 1'
      //   },
      //   {
      //     'patentId':'1234',
      //     'patentTitle':'Hi I am a patent 2'
      //   },
      //   {
      //     'patentId':'1234',
      //     'patentTitle':'testing a patent'
      //   },
      //   {
      //     'patentId':'9988',
      //     'patentTitle':'Hi I am a patent 1'
      //   },
      //   {
      //     'patentId':'1234',
      //     'patentTitle':'Hi I am a patent 2'
      //   }
      // ];

      this.templateDataFromStorage.previousSearch = this.templateDataFromStorage.previousSearch.filter(filterByIndex);
      window.app.localDataManager(false,'searchData',this.templateDataFromStorage);
      this.render();
    }
  });
})(window, Backbone, Handlebars, Templates);
