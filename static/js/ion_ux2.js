// Timestamp conversion methods to call when parsing response.
// Maybe put these into IONUX.Helpers namespace?
var epoch_to_iso = function(epoch_time){
    try {
      return new Date(parseInt(epoch_time)).toISOString().replace(/T/, ' ').replace(/.\d{3}Z$/, 'Z');
    } catch (err) {
      return epoch_time;
    };
};

var make_iso_timestamps = function(resp) {
  if(resp != null && 'type_' in resp) {
    if('ts_created' in resp) {
      resp['ts_created'] = epoch_to_iso(resp['ts_created']);
    }
    if('ts_updated' in resp) {
      resp['ts_updated'] = epoch_to_iso(resp['ts_updated']);
    }
  }

  _.each(resp, function(val, key) {
      if (typeof val == 'object') {
        make_iso_timestamps(val);
      };
  });
  return;
};

var get_template = function(url) {
    var data = "<h1> failed to load url : " + url + "</h1>";
    $.ajax({
        async: false,
        url: url,
        success: function(response) {
            data = response;
        }
    });
    return data;
}

IONUX = {
	Models: {},
	Collections: {},
	Views: {},
	Dashboard: {},
	init: function(){

		IONUX.Models.SessionInstance = new IONUX.Models.Session();
		IONUX.Models.HeaderInstance = new IONUX.Models.Header();

		IONUX.Views.HeaderInstance = new IONUX.Views.Header({model: IONUX.Models.HeaderInstance});

		IONUX.Models.HeaderInstance.fetch({
			async: false,
			dataType: 'html'
		});

		IONUX.Models.LeftSidebar = new IONUX.Models.Left();
		IONUX.Views.LeftSidebar = new IONUX.Views.Left({model: IONUX.Models.LeftSidebar});
		IONUX.Models.LeftSidebar.fetch({
			async: false,
			dataType: 'html'
		});

	    // Bootstrap navigation menu
	    $.ajax({
			async: false,
			url: '/ui/navigation/',
			success: function(resp) {
		        // MAPS Sidebar (initially shown)
		        IONUX.Dashboard.Observatories = new IONUX.Collections.Observatories(_.sortBy(resp.data.observatories,function(o){return o.spatial_area_name + (o.local_name ? o.local_name : '') + o.name}))
      		},
      	});

      	this.dashboard_map();
	},

	dashboard_map: function(){
	    //this._remove_dashboard_menu();
	    // disabling code to modify buttons since we don't have them in this case.
	    /*
	    $('.map-nested-ul').find('.active').removeClass('active');
	    
	    $('#left .resources-view').hide();
	    $('#left .map-view').show();
	    $('#btn-map').addClass('active').siblings('.active').removeClass('active');
	    */
	    
	    $('#upperMain').html(get_template('templates/block_map2.html')).show();
	    if (!IONUX.Dashboard.MapResources || !IONUX.Dashboard.MapResource) {
	      IONUX.Dashboard.MapResources = new IONUX.Collections.MapResources([], {resource_id: null});
	      IONUX.Dashboard.MapResource = new IONUX.Models.MapResource();
	      IONUX.Dashboard.MapDataResources = new IONUX.Collections.MapDataProducts([], {resource_id: null});
	    };
	    
	    // render empty table.
	    // but not really right now because it ain't gonna live at this spot anymore!
	    // new IONUX.Views.MapDataProductTable({el: $('#dynamic-container #2163993'), collection: IONUX.Dashboard.MapDataResources});
	    
	    
	    if (!IONUX.Dashboard.MapView){
	      IONUX.Dashboard.MapView = new IONUX.Views.Map({
	        collection: IONUX.Dashboard.Observatories,
	        model: IONUX.Dashboard.MapResource
	      });
	    }else{
	      IONUX.Dashboard.MapView.active_marker = null; // Track clicked icon
	      IONUX.Dashboard.MapView.map_bounds_elmt = $('#map_bounds');
	      IONUX.Dashboard.MapView.draw_map();
	      IONUX.Dashboard.MapView.draw_markers();
	    }
	}
  
};