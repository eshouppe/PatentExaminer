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
      'click .vennSearchView .vennResults #resultsChart .ct-point':'savePatent',
      'keypress .vennSearchView':'enterPressed',
      'change .vennSearchView .primaryResultsContainer input':'onFrequentWordSelectionInputChange'
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
      var $searchButton = this.$el.find('.searchContainer .searchnow');

      //Setup Primary search logic here
      this.changeLoader(true);
      $searchButton.attr('disabled',true);
      this.searchModel.searchText = $('.vennSearchView #search1').val() || '';

      function processResults(response) {
        //Update Search Model
        debugger;

        this.viewState = {primaryresults:true};
        this.viewTitle='Filter By Common Words';
        this.render();
        this.treeChart1 = new window.app.treeChart({
          "name": this.searchModel.searchText,
          "children": [
            {"name": "Ball"},
            {"name": "Steel"},
            {"name": "Carbon"},
            {"name":"Powder"},
            {"name":"Ship"},
            {"name":"Wood"},
            {"name":"Parrot"},
            {"name":"Treasure"},
            {"name":"Bounty"},
            {"name":"Wench"}
            // {
            //   "name":"Pirate",
            //   "children":[
            //     {"name":"Barbosa"},
            //     {"name":"Jack"}
            //   ]
            // }
          ]
        });
        this.changeLoader(false);
      }
      $.ajax({
        // url: '/venn/api/v1.0/search',
        url: 'http://localhost:5000/venn/api/v1.0/search',
        contentType: "application/json",
        dataType:'json',
        method:'POST',
        //data is the search term
        data:JSON.stringify({'primary':this.searchModel.searchText}),
        success: processResults,
        error: function(response){
          debugger;
          //var errorCode = JSON.parse(xhr.responseText);
          $searchButton.attr('disabled', false);
          this.changeLoader(false);
          showToast('Search Error Occurred - Code:' + response.status);
        }.bind(this)
      });

    },
    vennSearch: function () {
      this.changeLoader(true);
      //Update Search Model
      this.searchModel.s1 = $('.vennSearchView #search2').val() || '';
      this.searchModel.s2 = $('.vennSearchView #search3').val() || '';
      this.searchModel.s3 = $('.vennSearchView #search4').val() || '';
      var storedSearchData = window.app.localDataManager(true, 'searchData') || {};
      if (storedSearchData['previousSearch'] && storedSearchData['previousSearch'].constructor === Array) {
        storedSearchData['previousSearch'].push(this.searchModel);
      } else {
        storedSearchData['previousSearch'] = [];
        storedSearchData['previousSearch'].push(this.searchModel);
      }
      window.app.localDataManager(false,'searchData',storedSearchData);
      this.viewState = {vennresults:true};
      this.viewTitle='Venn Results';
      this.render();
      this.changeLoader(false);
      this.chart = new window.app.chartView();
      this.chart.drawGraph(this.tempFakeVennData2());
    },
    resetZoom: function () {
      this.chart.resetZoom();
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
    },
    tempFakeVennData: function () {
      return {
        "matchingPatentNums": ["4323119", "9256837", "9322223", "9544721", "7089160", "5992941", "9122728", "9009656", "7188090", "9019971", "9091140", "9521002", "8807242", "8140821", "9514154", "9542278", "9460444", "9524243", "9160606", "9535629", "8780401"],
        "numMatchedPatents": 21,
        "resultsToPlot": [{
          "full_search": [2],
          "patent_ID": "9322223",
          "series": 2,
          "x": 0.33352814889601656,
          "y": 0.19000498156127063
        }, {
          "full_search": [1, 2],
          "patent_ID": "5992941",
          "series": 3,
          "x": 0.10929895088340076,
          "y": 0.002346941301437168
        }, {
          "full_search": [1, 2],
          "patent_ID": "9009656",
          "series": 3,
          "x": 0.439179705887706,
          "y": -0.4303896233211017
        }, {
          "full_search": [1, 2],
          "patent_ID": "9521002",
          "series": 3,
          "x": 0.329176116669107,
          "y": -0.19021560779751778
        }, {
          "full_search": [1, 2],
          "patent_ID": "8807242",
          "series": 3,
          "x": -0.37101924808360315,
          "y": 0.3135603849295623
        }, {
          "full_search": [2],
          "patent_ID": "9542278",
          "series": 2,
          "x": -0.13618406890000995,
          "y": 0.2924221794509723
        }, {
          "full_search": [1, 2],
          "patent_ID": "9524243",
          "series": 3,
          "x": -0.398666928574141,
          "y": -0.28992593880563633
        }, {
          "full_search": [1, 2],
          "patent_ID": "9160606",
          "series": 3,
          "x": -0.2645322942744308,
          "y": -0.1589492255334406
        }, {
          "full_search": [1, 2],
          "patent_ID": "9535629",
          "series": 3,
          "x": -0.10206097141792475,
          "y": 0.016208546094341643
        }, {
          "full_search": [1],
          "patent_ID": "8780401",
          "series": 1,
          "x": -0.2743059224631802,
          "y": -0.022631982433892257
        }, {
          "full_search": [1],
          "patent_ID": "4323119",
          "series": 1,
          "x": 0.26973577910441293,
          "y": -0.3481144416771636
        }, {
          "full_search": [1],
          "patent_ID": "9256837",
          "series": 1,
          "x": -0.12485800130735049,
          "y": -0.02020601974509292
        }, {
          "full_search": [1],
          "patent_ID": "9544721",
          "series": 1,
          "x": 0.1922855600527753,
          "y": 0.2887026001364932
        }, {
          "full_search": [1],
          "patent_ID": "7089160",
          "series": 1,
          "x": 0.06452938381558393,
          "y": 0.29850707468999665
        }, {
          "full_search": [1],
          "patent_ID": "9122728",
          "series": 1,
          "x": -0.051614015355108275,
          "y": -0.21967544460508848
        }, {
          "full_search": [1],
          "patent_ID": "9019971",
          "series": 1,
          "x": -0.43870803751839954,
          "y": -0.2319184124959694
        }, {
          "full_search": [1],
          "patent_ID": "9091140",
          "series": 1,
          "x": 0.06250063444774649,
          "y": -0.14558082726596297
        }, {
          "full_search": [1],
          "patent_ID": "8140821",
          "series": 1,
          "x": 0.18611658738573214,
          "y": 0.39430347324397647
        }, {
          "full_search": [1],
          "patent_ID": "9514154",
          "series": 1,
          "x": 0.018161105119711238,
          "y": 0.12529324055268184
        }, {
          "full_search": [1],
          "patent_ID": "9460444",
          "series": 1,
          "x": 0.2075076326461213,
          "y": 0.25472015471415815
        }, {
          "full_search": [1],
          "patent_ID": "7188090",
          "series": 1,
          "x": -0.05007011701416581,
          "y": -0.11846205299402432
        }],
        "search1Circle": {"r": 0.3113606041595843, "x": -0.010386530526105633, "y": -0.025390903211170674},
        "search2Circle": {"r": 0.3676135809111213, "x": -0.006808954323764376, "y": -0.028326373568901372},
        "searchedString(s)": ["data", "mining"],
        "searchedTerms": ["data", "mining"]
      };
    },
    tempFakeVennData2: function () {
      return {
        "matchingPatentNums": ["4323119", "9256837", "9322223", "9544721", "7089160", "5992941", "9122728", "9009656", "7188090", "9019971", "9091140", "9521002", "8807242", "8140821", "9514154", "9542278", "9460444", "9524243", "9160606", "9535629", "8780401"],
        "numMatchedPatents": 21,
        "resultsToPlot": [
          {
            "patent_ID": "9322223",
            "series": 1,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322223",
            "series": 1,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322223",
            "series": 1,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322223",
            "series": 1,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322223",
            "series": 1,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322223",
            "series": 1,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322223",
            "series": 1,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322223",
            "series": 1,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322223",
            "series": 1,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322223",
            "series": 1,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322224",
            "series": 2,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322224",
            "series": 2,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322224",
            "series": 2,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322224",
            "series": 2,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322224",
            "series": 2,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322224",
            "series": 2,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322224",
            "series": 2,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322224",
            "series": 2,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322224",
            "series": 2,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322224",
            "series": 2,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322224",
            "series": 2,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322225",
            "series": 3,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322225",
            "series": 3,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322225",
            "series": 3,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322225",
            "series": 3,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322225",
            "series": 3,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322225",
            "series": 3,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322225",
            "series": 3,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322225",
            "series": 3,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322226",
            "series": 4,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322226",
            "series": 4,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322226",
            "series": 4,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322226",
            "series": 4,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322226",
            "series": 4,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322226",
            "series": 4,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322226",
            "series": 4,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          },
          {
            "patent_ID": "9322226",
            "series": 4,
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1)
          }
        ]
      }
    }
  });
})(window, Backbone, Handlebars, Templates);
