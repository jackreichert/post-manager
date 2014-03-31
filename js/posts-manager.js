
window.App = {
	State: 'initial',
	Models: {},
	Views: {},
	Collections: {},
	Router: {},

	Vent: _.extend({}, Backbone.Events),

	Templates: {
		postListItem: Handlebars.compile(jQuery('#post-template').html()),
		postArticle: Handlebars.compile(jQuery('#postContent-template').html()),
		author: Handlebars.compile(jQuery('#author-template').html()),
		type: Handlebars.compile(jQuery('#types-template').html()),
		taxonomy: Handlebars.compile(jQuery('#taxonomy-template').html()),
		term: Handlebars.compile(jQuery('#term-template').html())
	},

	init: function() {
		var managePosts = new App.Views.App;

		// load preloaded types
		var typesCollection = new App.Collections.Types();
		var typesView = new App.Views.Types({ collection: typesCollection });
		jQuery('#wpbody-content nav #types').replaceWith(typesView.render().el);

		// load preloaded authors
		var authorsCollection = new App.Collections.Authors();
		var authorsView = new App.Views.Authors({ collection: authorsCollection });
		jQuery('#wpbody-content nav #authors ul').replaceWith(authorsView.render().el);

		// load preloaded taxonomies
		var taxCollection = new App.Collections.Taxonomies();
		var taxView = new App.Views.Taxonomies({ collection : taxCollection });
		jQuery('#wpbody-content nav #SelectTax').replaceWith( taxView.render().el );
        
        jQuery('#wpbody-content nav #taxonomies').html('');
        taxCollection.each(function (tax) {
            var termCollection = new App.Collections.Terms( tax.get('terms') );
            var termView = new App.Views.Terms({ collection : termCollection });
            jQuery('#wpbody-content nav #taxonomies').append( termView.render().el );
        });

		// load preloaded posts
		var postsCollection = new App.Collections.Posts();
		var postsView = new App.Views.Posts({ collection : postsCollection });
		jQuery('#wpbody-content section ul#posts').replaceWith(postsView.render().el);
		jQuery('#wpbody-content section ul#posts li:first-child h3').click();

		new App.Router;
		Backbone.history.start();
	}
};


jQuery(document).ready(function() {
	window.App.init();
});
