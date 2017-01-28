this["Templates"] = this["Templates"] || {};
this["Templates"]["apiView"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "          <li class=\"mdl-list__item center\">\n            <span class=\"mdl-chip mdl-chip--contact\">\n            <span class=\"mdl-chip__contact mdl-color--teal mdl-color-text--white\">\n              <i class=\"material-icons mdl-list__item-icon\">description</i>\n            </span>\n            <span class=\"mdl-chip__text\">None Found.</span></span>\n          </li>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "          <li class=\"mdl-list__item center\">\n            <span class=\"mdl-chip mdl-chip--contact\">\n            <span class=\"mdl-chip__contact mdl-color--teal mdl-color-text--white\">\n              <i class=\"material-icons mdl-list__item-icon\">description</i>\n            </span>\n            <span class=\"mdl-chip__text\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</span></span>\n          </li>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "          <li class=\"mdl-list__item center\">\n            <span class=\"mdl-chip mdl-chip--contact\">\n            <span class=\"mdl-chip__contact mdl-color--teal mdl-color-text--white\">\n              <i class=\"material-icons mdl-list__item-icon\">find_in_page</i>\n            </span>\n            <span class=\"mdl-chip__text\">None Used.</span></span>\n          </li>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "          <li class=\"mdl-list__item center\">\n            <span class=\"mdl-chip mdl-chip--contact\">\n            <span class=\"mdl-chip__contact mdl-color--teal mdl-color-text--white\">\n              <i class=\"material-icons mdl-list__item-icon\">find_in_page</i>\n            </span>\n            <span class=\"mdl-chip__text\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</span></span>\n          </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid\">\n  <div class=\"mdl-grid\">\n\n    <div class=\"mdl-cell mdl-cell--6-col\">\n      <div class=\"title center\">\n        <h4>Documents Found</h4>\n      </div>\n      <ul class='mdl-list docFound'>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.docFound : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.docFound : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      </ul>\n    </div>\n    <div class=\"mdl-cell mdl-cell--6-col\">\n      <div class=\"title center\">\n        <h4>Searched Terms</h4>\n      </div>\n      <ul class='mdl-list searchedTerms'>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.searchedTerms : depth0),{"name":"unless","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.searchedTerms : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      </ul>\n    </div>\n  </div>\n</div>\n";
},"useData":true});
this["Templates"]["chartView"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"mdl-grid\">\n  <div class=\"mdl-cell mdl-cell--12-col\">\n    <div class=\"ct-chart ct-golden-section\" id=\"resultsChart\"></div>\n    <div class=\"mdl-grid\">\n      <div class=\"mdl-cell mdl-cell--12-col\">\n        <div class=\"title center\">\n          <h6 style=\"text-decoration: underline;\">Legend</h6>\n        </div>\n      </div>\n      <div class=\"mdl-cell mdl-cell--3-col\">\n        <div class=\"title center search1Legend\">\n          Search 1\n        </div>\n      </div>\n      <div class=\"mdl-cell mdl-cell--3-col\">\n        <div class=\"title center search2Legend\">\n          Search 2\n        </div>\n      </div>\n      <div class=\"mdl-cell mdl-cell--3-col\">\n        <div class=\"title center search3Legend\">\n          Search 3\n        </div>\n      </div>\n      <div class=\"mdl-cell mdl-cell--3-col\">\n        <div class=\"title center search4Legend\">\n          Search 4\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n";
},"useData":true});
this["Templates"]["scatterView"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid\">\n  Plot search coming soon\n</div>\n";
},"useData":true});
this["Templates"]["vennSearchView"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"searchContainer mdl-color-text--grey-100\">\n\n      <div class=\"mdl-grid\">\n        <div class=\"mdl-cell mdl-cell--12-col searchRow\">\n          <div class=\"inputForm\">\n            <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n              <input class=\"mdl-textfield__input\" type=\"text\" id=\"search1\">\n              <label class=\"mdl-textfield__label mdl-color-text--grey-100\" for=\"search1\">Enter a Primary Search</label>\n            </div>\n            <label class=\"mdl-button mdl-js-button mdl-button--icon mdl-layout--large-screen-only\" for=\"search1\">\n              <i class=\"material-icons\">search</i>\n            </label>\n          </div>\n        </div>\n        <div class=\"mdl-cell mdl-cell--12-col\">\n          <button class=\"searchnow center mdl-button mdl-js-button mdl-button--raised mdl-button--colored\">\n            Search <i class=\"material-icons\">search</i>\n          </button>\n        </div>\n      </div>\n    </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"primaryResultsContainer mdl-color-text--grey-100\">\n      <div class=\"mdl-grid\">\n        <div id=\"treeChartView\" class=\"mdl-cell mdl-cell--12-col\"></div>\n\n        <div class=\"mdl-grid wordInputContainer\">\n          <div class=\"mdl-cell mdl-cell--4-col\">\n            <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label wordSelection\">\n              <input class=\"mdl-textfield__input\" type=\"text\" id=\"search2\">\n              <label class=\"mdl-textfield__label mdl-color-text--grey-100\" for=\"search2\">Enter a Word</label>\n            </div>\n          </div>\n          <div class=\"mdl-cell mdl-cell--4-col\">\n            <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label wordSelection\">\n              <input class=\"mdl-textfield__input\" type=\"text\" id=\"search3\">\n              <label class=\"mdl-textfield__label mdl-color-text--grey-100\" for=\"search3\">Enter a word</label>\n            </div>\n          </div>\n          <div class=\"mdl-cell mdl-cell--4-col\">\n            <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label wordSelection\">\n              <input class=\"mdl-textfield__input\" type=\"text\" id=\"search4\">\n              <label class=\"mdl-textfield__label mdl-color-text--grey-100\" for=\"search4\">Enter a word</label>\n            </div>\n          </div>\n        </div>\n        <div class=\"mdl-cell mdl-cell--12-col\">\n          <button class=\"searchnow center mdl-button mdl-js-button mdl-button--raised mdl-button--colored\">\n            Select These Words <i class=\"material-icons\">search</i>\n          </button>\n        </div>\n      </div>\n\n    </div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"vennResults mdl-color-text--grey-100\">\n      <h4 class=\"center\">Venn Search Results</h4>\n      <div class=\"mdl-grid\">\n        <div class=\"mdl-cell mdl-cell--12-col\">\n          <div class=\"chartView\" style=\"width:100%;\"></div>\n        </div>\n        <div class=\"mdl-cell mdl-cell--12-col\">\n          <button class=\"reset center mdl-button mdl-js-button mdl-button--raised mdl-button--colored\">\n            Reset Zoom <i class=\"material-icons\">search</i>\n          </button>\n        </div>\n      </div>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"vennSearchView\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.primarysearch : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.primaryresults : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.vennresults : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n";
},"useData":true});
this["Templates"]["workBenchView"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "              <li class=\"mdl-list__item mdl-list__item--two-line\">\n              <span class=\"mdl-list__item-primary-content\">\n                <i class=\"material-icons mdl-list__item-avatar\">lightbulb_outline</i>\n                <span>"
    + alias2(alias1((depth0 != null ? depth0.patentId : depth0), depth0))
    + "</span>\n                <span class=\"mdl-list__item-sub-title\">"
    + alias2(alias1((depth0 != null ? depth0.patentTitle : depth0), depth0))
    + "</span>\n              </span>\n                <span class=\"mdl-list__item-secondary-content\">\n                  <span class=\"mdl-list__item-secondary-action removeSavedPatent\" data-idx=\""
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"index","hash":{},"data":data}) : helper)))
    + "\"><i class=\"material-icons\">clear</i></span>\n                </span>\n              </li>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "              <li class=\"mdl-list__item mdl-list__item--two-line\">\n                <span class=\"mdl-list__item-primary-content\">\n                  <i class=\"material-icons mdl-list__item-avatar\">search</i>\n                  <span>"
    + alias2(alias1((depth0 != null ? depth0.searchText : depth0), depth0))
    + "</span>\n                  <span class=\"mdl-list__item-sub-title\">\n                    Subsearch: "
    + alias2(alias1((depth0 != null ? depth0.s1 : depth0), depth0))
    + " "
    + alias2(alias1((depth0 != null ? depth0.s2 : depth0), depth0))
    + " "
    + alias2(alias1((depth0 != null ? depth0.s3 : depth0), depth0))
    + "\n                  </span>\n                </span>\n                <span class=\"mdl-list__item-secondary-content\">\n                  <span class=\"mdl-list__item-secondary-action removeSearch\" data-idx=\""
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"index","hash":{},"data":data}) : helper)))
    + "\"><i class=\"material-icons\">clear</i></span>\n                </span>\n              </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid workBenchView\">\n  <div class=\"mdl-cell mdl-cell--12-col\">\n    <div class=\"mdl-grid\">\n      <div class=\"mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-cell--4-col-phone\">\n        <div class=\"headerContainer\">\n          <h5>Workbench</h5>\n          <p>Saved patents from previous results</p>\n        </div>\n        <div class=\"mdl-cell mdl-cell--12-col listContainer\">\n          <ul class=\"demo-list-two mdl-list\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.savedPatents : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "          </ul>\n        </div>\n      </div>\n      <div class=\"mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-cell--4-col-phone\">\n        <div class=\"headerContainer\">\n          <h5>Previous Searches</h5>\n          <p>Select a search to reload</p>\n        </div>\n        <div class=\"mdl-cell mdl-cell--12-col listContainer\">\n          <ul class=\"demo-list-two mdl-list\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.previousSearch : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "          </ul>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n";
},"useData":true});