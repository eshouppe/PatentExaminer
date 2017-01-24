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
    frequentWordModel: {
      's1':'',
      's2':'',
      's3':''
    },
    events: {
      'click .vennSearchView .searchContainer .searchnow':'primarySearch',
      'click .vennSearchView .primaryResultsContainer .searchnow':'vennSearch',
      'click .vennSearchView .primaryResultsContainer .topic':'commonWordOnGraphSelection',
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
      //Setup Primary search logic here
      this.changeLoader(true);
      this.viewState = {primaryresults:true};
      this.viewTitle='Filter By Common Words';
      this.render();
      this.treeChart1 = new window.app.treeChart({
        "name": "Pirate",
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
    },
    vennSearch: function () {
      this.changeLoader(true);
      this.viewState = {vennresults:true};
      this.viewTitle='Venn Results';
      this.render();
      this.changeLoader(false);
      this.chart = new window.app.chartView();
      this.chart.drawGraph(window.app.data.primarySearch);

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
