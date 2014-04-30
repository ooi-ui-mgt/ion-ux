IONUX2.Models.Header = Backbone.Model.extend({
	url: '/templates/header2.html',
	html: '',
	parse: function(resp){
		console.log('got response from /bootstrap/header2.html.');
		this.html = resp;
		this.trigger('change:html');
		return resp;
	}
});

IONUX2.Models.LoginTemplate = Backbone.Model.extend({
	url: '/templates/partials/login2.html',
	html: '',
	parse: function(resp){
		console.log('got response from /templates/partials/login2.html.');
		this.html = resp;
		this.trigger('change:html');
		return resp;
	}
});

// For use with collections of Resource Types, i.e. InstrumentDevice, PlatformDevice, etc.
IONUX2.Models.Session = Backbone.Model.extend({
    defaults: {
        actor_id: null,
        user_id: null,
        name: "Guest",
        is_logged_in: false,
        is_registered: null,
        version: {},
        roles: [],
        ui_mode: 'PRODUCTION',
        is_polling: false,
        ui_theme_dark: false,
        valid_until: null
    },
    url: '/session/',
    initialize: function() {
      _.bindAll(this);
    },
    parse: function(resp){
    	console.log('got response from /session/.');
    	this.trigger('change:session');
        return resp.data;
    },
    is_logged_in: function(){
      return this.get('is_logged_in');
    },
    is_registered: function() {
      return this.get('is_registered');
    },
    is_resource_owner: function(){
      return _.findWhere(MODEL_DATA.owners, {_id: this.get('user_id')}) ? true : false;
    },
    is_valid: function(){
      return new Date(this.get('valid_until') * 1) >= new Date()
    },
    set_polling: function() {
      if (this.get('is_logged_in')) {
        this.set('is_polling', true);
        setTimeout(this.poll, 60000);
      };
    },
    poll: function() {
      // If their session has expired (i.e. their certificate's is_valid date has passed),
      // let the user know and give the option to login.  Do not continue to poll the session.
      if (this.is_logged_in() && !this.is_valid()) {
        // IONUX2.ROUTER.signin_from_expired_session();
        return;
      }
      var self = this;
      var existing_roles = _.clone(this.get('roles'));
      if (this.get('is_polling')) {
        this.fetch({
          global: false,
          success: function(resp) {
            self.set_polling();
            if (!_.isEqual(existing_roles, resp.get('roles'))) {
              self.check_roles(existing_roles);
            };
          },
          error: function(resp) {
            self.set('is_polling', false);
          }
        });
      };
    },
    check_roles: function(existing_roles) {
      var roles = this.get('roles');
      var new_roles = {};
      _.each(roles, function(v,k) {
        if (!_.has(existing_roles, k)) {
          new_roles[k] = v;
        } else {
          var added_roles = _.difference(roles[k], existing_roles[k]);
          if (added_roles.length) new_roles[k] = added_roles;
        };
      });
      // if (!_.isEmpty(new_roles)) new IONUX2.Views.NewRoles({new_roles: new_roles}).render().el;
    },
});

IONUX2.Models.Login = Backbone.Model.extend({
	initialize: function(){
		console.log('initializing login model.');
	},
	setModels: function(templateModel, sessionModel){
		this.templateModel = templateModel;
		this.sessionModel = sessionModel;
		console.log(this.sessionModel);
		this.templateModel.on('change:html', this.setTemplate, this);
		this.sessionModel.on('change:session', this.setSession, this);
	},
	setTemplate: function(){
		console.log('setting html from login template.');
		this.html = this.templateModel.html;
		this.trigger('change:html');
	},
	setSession: function(){
		console.log('setting data from session.');
		this.data = this.sessionModel.toJSON();
    console.log(this.data);
		this.trigger('change:session');
	},
	fetch: function(options){
	    console.log(typeof this.html);
	    if( typeof this.html == 'undefined'){
	  		this.templateModel.fetch({
	  			async: false,
	  			dataType: 'html'
	  		});
	    }

		this.sessionModel.fetch({
			async: false
		});
	}
});

IONUX2.Models.SearchTabContent = Backbone.Model.extend({
  initialize: function() {
    console.log('initializing left sidebar model');
  },
  url: '/templates/accordion.html',
  html: '',
  parse: function(resp){
    console.log('got response from /bootstrap/accordion.html.');
    this.html = resp;
    this.trigger('change:html');
    return resp;
  }
});

IONUX2.Collections.Observatories = Backbone.Collection.extend({
  url: '/Observatory/list/',
  parse: function(resp) {
    return resp.data;
  }
});

IONUX2.Models.DataTypeList = Backbone.Model.extend({
	url: '/get_data_product_group_list/',
	data: '',
	parse: function(resp){
		console.log('got response from /get_data_product_group_list/.');
		this.data = resp.data;
		this.trigger('change:data');
		return resp;
	}
});
		
IONUX2.Collections.Orgs = Backbone.Collection.extend({
  url: '/orgs/list/',
  parse: function(resp) {
	  data = _.sortBy(resp.data.orgs,function(o){return o.name});
	  this.set(data);
	  this.trigger('change:data');
	  return data;
  }
});

/*IONUX2.Collections.MapDataProducts = Backbone.Collection.extend({
  initialize: function(models, options){
    this.resource_id = options.resource_id;
    console.log("resource id is " + this.resource_id);
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
});*/



IONUX2.Models.Instruments = Backbone.Model.extend({
  defaults: {
    name: 'glider'
  }
});
IONUX2.Models.instruments = new IONUX2.Models.Instruments();

IONUX2.Models.SaveSpatialSearch = Backbone.Model.extend({
  defaults: {
      accordion_visible: false,
      spatial_dropdown: "1",
      from_latitude: "",
      from_ns: "",
      from_longitude: "",
      from_ew: "",
      to_latitude: "",
      to_ns: "",
      to_longitude: "",
      to_ew: "",
      radius: "",
      miles_kilos: "",
      vertical_from: "",
      vertical_to: "",
      feet_miles: ""
  }
});

IONUX2.Collections.SaveFacilitySearch = Backbone.Collection.extend({});
IONUX2.Collections.saveFacilitySearch = new IONUX2.Collections.SaveFacilitySearch();

IONUX2.Collections.SaveRegionSearch = Backbone.Collection.extend({});
IONUX2.Collections.saveRegionSearch = new IONUX2.Collections.SaveRegionSearch();

IONUX2.Collections.SaveSiteSearch = Backbone.Collection.extend({});
IONUX2.Collections.saveSiteSearch = new IONUX2.Collections.SaveSiteSearch();

IONUX2.Collections.SaveDataTypeSearch = Backbone.Collection.extend({});
IONUX2.Collections.saveDataTypeSearch = new IONUX2.Collections.SaveDataTypeSearch();

IONUX2.Models.saveSpatialSearch = new IONUX2.Models.SaveSpatialSearch();

IONUX2.Models.SaveTemporalSearch = Backbone.Model.extend({
  defaults: {
    accordion_visible: false,
    temporal_dropdown: '',
    from_year: '',
    from_month: '',
    from_day: '',
    from_hour: '',
    to_year: '',
    to_month: '',
    to_day: '',
    to_hour: '',
  }
});

IONUX2.Models.saveTemporalSearch = new IONUX2.Models.SaveTemporalSearch();

IONUX2.Models.Facilities = Backbone.Model.extend({});
IONUX2.Models.facilities = new IONUX2.Models.Facilities();

IONUX2.siteData = [];
IONUX2.siteDataObj = {};

//IONUX2.Collections.mapDataProducts = new IONUX2.Collections.MapDataProducts();
