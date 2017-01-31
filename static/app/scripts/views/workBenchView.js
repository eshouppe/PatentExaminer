/**
 * Created by ryancarlton on 1/25/17.
 */
(function (window, Backbone, Handlebars, Templates) {
  window.app.workBenchView = Backbone.View.extend({
    template: '<span>workBenchView view</span>',
    el: '#appView',
    events:{
      'click .workBenchView .removeSearch':'removeSearch',
      'click .workBenchView .removeSavedPatent':'removePatent',
      'click .workBenchView .savedPatent':'openSavedPatent',
      'click .workBenchView .savedSearch':'openSavedSearch'
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
    openSavedPatent: function (event) {
      var patentId = $(event.currentTarget).data('patentid') || null,
        url = 'https://patents.google.com/patent/';
      if (patentId) {
        patentId = "US" + patentId;
        url = url + patentId + '/en';
        window.open(url,'_blank');
      }
    },
    openSavedSearch: function (event) {
      var searchIdx = $(event.currentTarget).data('idx');
      function filterByIndex(elm,idx) {
        return (idx === searchIdx);
      }
      selectedSavedSearchData = this.templateDataFromStorage.previousSearch.filter(filterByIndex)[0] || null;
      if (selectedSavedSearchData) {
        window.app.data.reSearch = selectedSavedSearchData;
        window.location.href = "/#vennSearch";
      } else {
        window.app.showToast("Saved Search Corrupted")
      }
    },
    removePatent: function (event) {
      var searchIdx = $(event.currentTarget).data('idx');
      function filterByIndex(elm,idx) {
        return (idx !== searchIdx);
      }
      this.templateDataFromStorage.savedPatents = this.templateDataFromStorage.savedPatents.filter(filterByIndex);
      window.app.localDataManager(false,'searchData',this.templateDataFromStorage);
      this.render();
      event.stopPropagation();
    },
    removeSearch: function (event) {
      var searchIdx = $(event.currentTarget).data('idx');
      function filterByIndex(elm,idx) {
        return (idx !== searchIdx);
      }
      this.templateDataFromStorage.previousSearch = this.templateDataFromStorage.previousSearch.filter(filterByIndex);
      window.app.localDataManager(false,'searchData',this.templateDataFromStorage);
      this.render();
      event.stopPropagation();
    }
  });
})(window, Backbone, Handlebars, Templates);
