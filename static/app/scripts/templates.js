this["Templates"] = this["Templates"] || {};
this["Templates"]["apiView"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<p>\n  test view from api View!!!!!!!! this is from an hbs:"
    + container.escapeExpression(((helper = (helper = helpers.user || (depth0 != null ? depth0.user : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"user","hash":{},"data":data}) : helper)))
    + "\n</p>\n";
},"useData":true});
this["Templates"]["homeView"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<p>home view</p>\n";
},"useData":true});