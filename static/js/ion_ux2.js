IONUX = {
	Models: {},
	Views: {},
	init: function(){

		IONUX.Models.SessionInstance = new IONUX.Models.Session();
		IONUX.Models.HeaderInstance = new IONUX.Models.Header();

		IONUX.Views.HeaderInstance = new IONUX.Views.Header({model: IONUX.Models.HeaderInstance});

		IONUX.Models.HeaderInstance.fetch({
			async: false,
			dataType: 'html'
		});
	}
}