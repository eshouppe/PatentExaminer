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
    searchModel: {
      'searchText':'',//primary for the api
      's1':'',
      's2':'',
      's3':''
    },
    frequentWordModel: {
      's1':'',
      's2':'',
      's3':''
    },
    events: {
      'click .vennSearchView .searchContainer .searchnow':'primarySearch',
      'click .vennSearchView .primaryResultsContainer .searchnow':'vennSearch',
      'click .vennSearchView .primaryResultsContainer .topic':'commonWordOnGraphSelection',
      'click .vennSearchView .vennResults .reset':'resetZoom',
      'mouseup  .ct-point' : 'savePatent',
      'click  .ct-point' : 'savePatent2',
      'keypress .vennSearchView':'enterPressed',
      'change .vennSearchView .primaryResultsContainer input':'onFrequentWordSelectionInputChange'
    },
    initialize: function () {
      //Reup the state if need be
      if (window.app.data.reSearch) {
        this.reRunSavedSearch(window.app.data.reSearch);
        window.app.data.reSearch = null;
      } else {
        this.render();
      }
    },
    render: function () {
      this.template = Templates.vennSearchView(this.viewState);
      this.changePageTitle(this.viewTitle);
      this.$el.html(this.template);
      //required after adding new material items
      componentHandler.upgradeDom();
    },
    primarySearch: function () {
      var $searchButton = this.$el.find('.searchContainer .searchnow');

      //Setup Primary search logic here
      this.searchModel.searchText = $('.vennSearchView #search1').val() || '';
      if (this.searchModel.searchText === '') {
        window.app.showToast('Nothing Searched. Try Again');
        return;
      }
      this.changeLoader(true);
      $searchButton.attr('disabled',true);

      function processResults(response) {
        //Update Search Model
        var newTreeData = {
          "name": response.primary_search || '',
          "children": []
        };
        $.each(response.common_words,function (idx,name) {
          newTreeData.children.push({"name":name});
        });
        this.viewState = {primaryresults:true};
        this.viewTitle='Filter By Common Words';
        this.render();
        this.treeChart1 = new window.app.treeChart(newTreeData);
        this.changeLoader(false);
      }
      $.ajax({
        //url: 'http://127.0.0.1:5000/venn/api/v1.0/search/primary',
        url: '/venn/api/v1.0/search/primary',
        contentType: "application/json",
        dataType:'json',
        method:'POST',
        //data is the search term
        data:JSON.stringify({'primary':this.searchModel.searchText}),
        success: processResults.bind(this),
        error: function(response) {
          //var errorCode = JSON.parse(xhr.responseText);
          $searchButton.attr('disabled', false);
          this.changeLoader(false);
          window.app.showToast('Search Error Occurred - Code:' + response.status);
        }.bind(this)
      });

    },
    reRunSavedSearch: function (previousSearch) {
      this.searchModel.searchText = previousSearch.searchText;
      this.searchModel.s1 = previousSearch.s1;
      this.searchModel.s2 = previousSearch.s2;
      this.searchModel.s2 = previousSearch.s3;
      this.vennSearch(true);
    },
    vennSearch: function (searchIsSaved) {
      if (searchIsSaved !== true) {
        this.searchModel.s1 = $('.vennSearchView #search2').val() || '';
        this.searchModel.s2 = $('.vennSearchView #search3').val() || '';
        this.searchModel.s3 = $('.vennSearchView #search4').val() || '';
      }
      var $searchButton = this.$el.find('.primaryResultsContainer .searchnow');
      this.changeLoader(true);
      $searchButton.attr('disabled',true);
      function saveSearch(searchModel) {
        var storedSearchData = window.app.localDataManager(true, 'searchData') || {};
        if (storedSearchData['previousSearch'] && storedSearchData['previousSearch'].constructor === Array) {
          storedSearchData['previousSearch'].push(searchModel);
        } else {
          storedSearchData['previousSearch'] = [];
          storedSearchData['previousSearch'].push(searchModel);
        }
        window.app.localDataManager(false,'searchData',storedSearchData);
      }
      function processResponse(response) {
        if (searchIsSaved !== true) {
          saveSearch(this.searchModel);
        }
        this.viewState = {vennresults:true};
        this.viewTitle='Venn Results';
        $searchButton.attr('disabled',false);
        this.changeLoader(false);
        this.render();

        this.chart = new window.app.chartView(this.searchModel);
        this.chart.drawGraph(response);
      }
      this.changeLoader(true);
      //Update Search Model
      $.ajax({
        //url: 'http://127.0.0.1:5000/venn/api/v1.0/search/secondary',
        url: '/venn/api/v1.0/search/secondary',
        contentType: "application/json",
        dataType:'json',
        method:'POST',
        //data is the search term
        data:JSON.stringify({
          'primary':this.searchModel.searchText,
          's1':this.searchModel.s1 || '',
          's2':this.searchModel.s2 || '',
          's3':this.searchModel.s3 || ''
        }),
        success: processResponse.bind(this),
        error: function(response) {
          $searchButton.attr('disabled', false);
          this.changeLoader(false);
          window.app.showToast('Search Error Occurred - Code:' + response.status);
        }.bind(this)
      });

    },
    resetZoom: function () {
      this.chart.resetZoom();
    },
    savePatent2: function(event) {
      console.log('click event');
      console.log(event);
    },
    savePatent: function (event) {
      debugger;
      var meta = $(event.currentTarget).attr('ct:meta'),
        numAndTitle = meta.split(':'),
        patNum = numAndTitle[0],
        title = numAndTitle[1],
        newPatentDoc = {
          'patentId':patNum,
          'patentTitle':title
        };
        console.log('clicked');
        console.log(meta);
      var storedSearchData = window.app.localDataManager(true, 'searchData') || {};
      if (storedSearchData['savedPatents'] && storedSearchData['savedPatents'].constructor === Array) {
        storedSearchData['savedPatents'].push(newPatentDoc);
      } else {
        storedSearchData['savedPatents'] = [];
        storedSearchData['savedPatents'].push(newPatentDoc);
      }
      window.app.localDataManager(false,'searchData',storedSearchData);
      window.app.showToast('Patent saved to workbench.')
    },
    enterPressed: function (event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode == '13') {
        if (this.viewState.primarysearch){
          $('.vennSearchView .searchContainer .searchnow').click();
        } else if (this.viewState.primaryresults) {
          $('.vennSearchView .primaryResultsContainer .searchnow').click();
        }
      }
    },
    changeLoader: function (show) {
      window.app.showHideLoadingBar(show);
    },
    changePageTitle: function (newtitle) {
      window.app.changePageTitle(newtitle);
    },
    onFrequentWordSelectionInputChange: function (event) {
      var currentInput = this.$el.find(event.currentTarget),
        inputChangedNewValue = currentInput.val();
      if (currentInput.attr('id') === 'search2') {
        this.frequentWordModel.s1 = inputChangedNewValue;
      }
      if (currentInput.attr('id') === 'search3') {
        this.frequentWordModel.s2 = inputChangedNewValue;
      }
      if (currentInput.attr('id') === 'search4') {
        this.frequentWordModel.s3 = inputChangedNewValue;
      }
      this.syncGraphAndSearchInputs();
    },
    commonWordOnGraphSelection: function (event) {
      var currentSelection = $(event.currentTarget),
        selection = currentSelection.data('topic');
      //Based on active class present decide if adding or removing a term
      if(currentSelection.hasClass('active')) {
        currentSelection.removeClass('active');
        this.addRemoveTermToFrequentModel(selection,true);
      } else if (!currentSelection.hasClass('active')) {
        currentSelection.addClass('active');
        this.addRemoveTermToFrequentModel(selection,false);
      }
      this.syncGraphAndSearchInputs();

    },
    addRemoveTermToFrequentModel: function (term, remove) {
      var found = false,
        countOfTerms = 0,
        frequentWord,
        context = this;

      for(frequentWord in context.frequentWordModel) {
        if (context.frequentWordModel[frequentWord] === term) {
          found = true;
        }
        if (context.frequentWordModel[frequentWord] !== '') {
          countOfTerms += 1;
        }
      }


      if (remove) {

        if (!found || countOfTerms === 0) {
          return;
        }
        if (context.frequentWordModel.s1 === term) {
          context.frequentWordModel.s1 = '';
        } else if (context.frequentWordModel.s2 === term) {
          context.frequentWordModel.s2 = '';
        } else if (context.frequentWordModel.s3 === term) {
          context.frequentWordModel.s3 = '';
        }
      } else {
        if (found) {
          return;
        }
        if (countOfTerms === 3) {
          for(frequentWord in context.frequentWordModel) {
            context.frequentWordModel[frequentWord]  = '';
          }
        }
        if (context.frequentWordModel.s1 === '') {
          context.frequentWordModel.s1 = term;
        } else if (context.frequentWordModel.s2 === '') {
          context.frequentWordModel.s2 = term;
        } else if (context.frequentWordModel.s3 === '') {
          context.frequentWordModel.s3 = term;
        }
      }
    },
    syncGraphAndSearchInputs: function () {
      var search1 = $('#search2'),
        search2 = $('#search3'),
        search3 = $('#search4'),
        context = this,
        allTopicNodes = this.$el.find('.topic');
        //allActiveTopicNodes = this.$el.find('.topic.active');

      function updateGraph() {
        allTopicNodes.removeClass('active');
        context.$el.find('.topic[data-topic="'+ context.frequentWordModel.s1 +'"]').addClass('active');
        context.$el.find('.topic[data-topic="'+ context.frequentWordModel.s2 +'"]').addClass('active');
        context.$el.find('.topic[data-topic="'+ context.frequentWordModel.s3 +'"]').addClass('active');
      }
      function updateInputFields() {
        context.$el.find('.primaryResultsContainer input')
          .val('')
          .parent()
          .removeClass('is-dirty')
          .removeClass('is-focused');
        if (context.frequentWordModel.s1 !== '') {
          search1
            .val(context.frequentWordModel.s1)
            .parent()
            .addClass('is-dirty')
            .addClass('is-focused');
        }
        if (context.frequentWordModel.s2 !== '') {
          search2
            .val(context.frequentWordModel.s2)
            .parent()
            .addClass('is-dirty')
            .addClass('is-focused');
        }
        if (context.frequentWordModel.s3 !== '') {
          search3
            .val(context.frequentWordModel.s3)
            .parent()
            .addClass('is-dirty')
            .addClass('is-focused');
        }
      }
      updateGraph();
      updateInputFields();
    }
  });
})(window, Backbone, Handlebars, Templates);
