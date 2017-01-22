/**
 * Created by ryancarlton on 1/20/17.
 */

(function (window, Backbone, Handlebars, Templates) {
  window.app.homeView = Backbone.View.extend({
    template: Templates.homeView(),
    el: '#appView',
    events: {
      'click .searchnow': 'searchNow',
      'click .resetZoom': function () {
        this.chart.resetZoom();
      }
    },
    initialize: function () {
      this.render();
      //create chart
      this.chart = new window.app.chartView();
      //Restore state if need be
      if (window.app.data.primarySearch) {
        $('.searchContainer #search1').val(window.app.data.primarySearch.searchedTerms[0] || '');
        $('.searchContainer #search2').val(window.app.data.primarySearch.searchedTerms[1] || '');
        this.chart.drawGraph(window.app.data.primarySearch);
      }
      //required after adding new material items
      componentHandler.upgradeDom();
    },
    render: function () {
      this.$el.html(this.template);
      window.app.changePageTitle('Home');
      //reinit dom with mdl
      //componentHandler.upgradeDom();
    },
    searchNow: function () {
      //TODO move these to be globals of the given view
      var $progressBar = $('.searchContainer .searchProgress'),
        $searchButton = $('.searchContainer .searchnow'),
        $searchBox1 = $('.searchContainer #search1'),
        $searchBox2 = $('.searchContainer #search2'),
        context = this;

      //Start search
      $searchButton.attr('disabled', true);
      $progressBar.fadeIn();

      var searchObj = {
        'search1': $searchBox1.val() || '',
        'search2': $searchBox2.val() || ''
      };
      if (searchObj['search1'] === '' && searchObj['search2'] !== '') {
        searchObj.search1 = searchObj.search2;
        searchObj.search2 = '';
      }
      function populateApiResults(data) {
        window.app.data.docsFound = data.matchingPatentNums;
        window.app.data.searchedTerms = data.searchedTerms;
        window.app.data.primarySearch = data;
        context.chart.drawGraph(data);
      }
      function processResults(data) {
        //Successfully made search
        populateApiResults(data);
        //drawGraph(data);
        window.app.showToast('Search Finished');
        $searchButton.attr('disabled', false);
        $progressBar.fadeOut();
      }

      $.ajax({
         url: '/venn/api/v1.0/search',
        //url: 'http://localhost:5000/venn/api/v1.0/search',
        contentType: "application/json",
        dataType: 'json',
        method: 'POST',
        //data is the search term
        data: JSON.stringify(searchObj),
        success: processResults,
        error: function (response) {
          //var errorCode = JSON.parse(xhr.responseText);
          $searchButton.attr('disabled', false);
          $progressBar.fadeOut();
          window.app.showToast('Search Error Occurred - Code:' + response.status);
        }
      });
    }
  });
})(window, Backbone, Handlebars, Templates);
