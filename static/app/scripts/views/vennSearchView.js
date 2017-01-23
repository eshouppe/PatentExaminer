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
      'click .vennSearchView .searchnow':'primarySearch',
      'click .topic':'commonWordSelection'
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
      this.viewTitle='Filter By Common Words';
      this.render();
      this.treeChart1 = new window.app.treeChart();
    },
    changePageTitle: function (newtitle) {
      window.app.changePageTitle(newtitle);
    },
    commonWordSelection: function (event) {
      var getAllActive = $('.topic.active'),
        currentSelection = $(event.currentTarget),
        selection = currentSelection.data('topic'),
        search1 = $('#search2'),
        search2 = $('#search3'),
        search3 = $('#search4');
      //Deal with unselection
      if (currentSelection.hasClass('active')) {
        currentSelection.removeClass('active');
        if (search1.val() === selection) {
          search1.val('').parent().removeClass('is-dirty').removeClass('is-focused');
        } else if (search2.val() === selection) {
          search2.val('').parent().removeClass('is-dirty').removeClass('is-focused');
        } else if (search3.val() === selection) {
          search3.val('').parent().removeClass('is-dirty').removeClass('is-focused');
        }
        return;
      }
      if (getAllActive.length > 2) {
        $('.topic').removeClass('active');
        search1.val('');
        search2.val('');
        search3.val('');
      }
      if (search1.val() === '') {
        search1.val(selection).parent().addClass('is-dirty').addClass('is-focused');
      } else if (search2.val() === '') {
        search2.val(selection).parent().addClass('is-dirty').addClass('is-focused');
      } else if (search3.val() === '') {
        search3.val(selection).parent().addClass('is-dirty').addClass('is-focused');
      }
      $(event.currentTarget).addClass('active');

    }

  });
})(window, Backbone, Handlebars, Templates);
