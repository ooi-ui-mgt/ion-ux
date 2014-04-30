IONUX2.Models.MapResource = Backbone.Model.extend({
  defaults: {
    geospatial_point_center: {
      lat: 39.8106460,
      lon: -98.5569760
    },
    constraint_list: null
  }
});

IONUX2.Collections.MapResources = Backbone.Collection.extend({
  initialize: function(models, options){
    this.resource_id = options.resource_id;
  },
  url: function() {
   return '/related_sites/'+this.resource_id+'/';
  },
  parse: function(resp) {
    var related_sites = [];
    _.each(resp.data, function(site){related_sites.push(site)});
    make_iso_timestamps(related_sites);
    return related_sites;
  }
});

IONUX2.Collections.MapDataProducts = Backbone.Collection.extend({
  initialize: function(models, options){
    this.resource_id = options.resource_id;
  },
  url: function() {
   return '/find_site_data_products/'+this.resource_id+'/';
  },
  parse: function(resp) {
    var data_products = [];
    if (!_.isEmpty(resp.data.data_product_resources)) {
      data_products = _.filter(resp.data.data_product_resources, function(v,k) {
        return !_.isEmpty(v.ooi_product_name); // Only display those with ooi_product_name
      });
      make_iso_timestamps(data_products);
    };
    return data_products;
  }
});

IONUX2.Collections.Instruments = Backbone.Collection.extend({
  model: IONUX2.Models.Instruments,
  initialize: function(models, options){
    console.log("resource id is " + options.resource_id);
    this.resource_id = options.resource_id;
    //console.log("resource id is " + this.resource_id);
  },
  url: function() {
   return '/find_site_data_products/'+this.resource_id+'/';
  },
  
  parse: function(resp) {
    var data_products = [];
    //console.log("site resources are " + resp.data.site_resources);
    if (!_.isEmpty(resp.data.site_resources)) {
      site_resources = _.filter(resp.data.site_resources, function(v,k) {
        return !_.isEmpty(v); // Only display those with ooi_product_name
      });
      make_iso_timestamps(site_resources);
    };
    for (item in site_resources) {
      //console.log("items are " + site_resources[item].name);
      //$('.instrument_list').append('<li>' + site_resources[item].name + '</li>');
    }
    console.log('site resources are ' + site_resources);
    //return new Backbone.Collection.add(site_resources);
    //return new Backbone.Collection(site_resources);
    return site_resources;
    //IONUX2.Collections.Instruments
  }
});

