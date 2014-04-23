// renders the contents of the Header div of the page frame.



IONUX.Views.Header = Backbone.View.extend({
	el: '#header',
	initialize: function() {
		this.model.on('change:html', this.render, this);
	},
	render: function(){
		console.log('rendering header view');
		this.$el.html(this.model.html);
		return this;
	}
});

// responds to model in two ways.  Captures fetched template
// and renders with loaded template when data (session) is
// fetched.
IONUX.Views.Login = Backbone.View.extend({
	el: '#login',
	events: {
		'click #userprofile': 'userprofile',
		'click #signup': 'create_account'
	},
	initialize: function(){
		this.model.on('change:html', this.setTemplate, this);
		this.model.on('change:session', this.render, this);
	},
	setTemplate: function(){
		console.log('setting login template');
		this.template = _.template(this.model.html);
		return this;
	},
	render: function(){
		console.log('rendering login view');
		this.$el.html(this.template(this.model.data));
		return this;
	}
});

IONUX.Views.Left = Backbone.View.extend({
	el: '#left',
	events: {
		'click .accordion_title': 'expandHide'
	},
	initialize: function() {
		this.model.on('change:html', this.render, this);
	},
	expandHide: function(e) {
		e.preventDefault();
		var $link = $(e.currentTarget);
		$link.parent().find('.spatial_details').slideToggle('fast', function() {
			if ($(this).is(':visible')) {
            	$link.find('.expand_hide').removeClass('arrow_right').addClass('arrow_down');              
        	} else {
        		$link.find('.expand_hide').removeClass('arrow_down').addClass('arrow_right');
       		}        
		});
	},
	render: function() {
		console.log('rendering left side view');
		this.$el.html(this.model.html);
		return this;
	}
});

IONUX.Views.Region = Backbone.View.extend({
	el: '#region',
	template: _.template('<span class="accordion_title">' + 
    '<div class="expand_hide arrow_down"></div><div class="accordion_label">Region</div>' + 
  	'</span><div class="spatial_details"><ul>' + 
  		'<% _.each(this.collection, function(model) { %>' + 
  		'<li><%= model %></li>' + 
  		'<% }); %>' + 
  	'</ul></div>'),
	initialize: function() {
		console.log('initializing region view');
		console.log('collection is ' + this.collection);
		this.render();
	},
	render: function() {
		console.log('rendering region');
		this.$el.html(this.template());
		/*var tmpl = this.template({ regions: this.collection.toJSON() });
		this.$el.html(tmpl);*/
		return this;
	}
});

