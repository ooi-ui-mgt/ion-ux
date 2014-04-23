IONUX.Models.Header = Backbone.Model.extend({
	url: '/templates/header2.html',
	html: '',
	parse: function(resp){
		console.log('got response from /bootstrap/header2.html.');
		this.html = resp;
		this.trigger('change:html');
		return resp;
	}
});

IONUX.Models.LoginTemplate = Backbone.Model.extend({
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
IONUX.Models.Session = Backbone.Model.extend({
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
        // IONUX.ROUTER.signin_from_expired_session();
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
      // if (!_.isEmpty(new_roles)) new IONUX.Views.NewRoles({new_roles: new_roles}).render().el;
    },
});

IONUX.Models.Login = Backbone.Model.extend({
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

IONUX.Models.Left = Backbone.Model.extend({
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

IONUX.Collections.Observatories = Backbone.Collection.extend({
  url: '/Observatory/list/',
  parse: function(resp) {
    return resp.data;
  }
});

