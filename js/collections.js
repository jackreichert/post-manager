
// post types
App.Collections.Types = Backbone.Collection.extend({
	model: App.Models.Type,

	url: PM_Ajax.ajaxurl,

	initialize: function() {
		if(PM_Ajax.collections.types) {
			this.add(jQuery.parseJSON(PM_Ajax.collections.types));
		} else {
			this.queryTypes();
		}
	},

	queryTypes: function() {
		this.fetch({
			data: {
				action: 'ajax-PMgetData',
				paramsNonce: PM_Ajax.paramsNonce,
				request: 'getTypes'
			},

			type: 'POST',

			success: function(collection, object, jqXHR) {
				console.log(object);
				var typesView = new App.Views.Types({ collection: collection });
				jQuery('#wpbody-content nav #types').replaceWith(typesView.render().el);
			},

			error: function(jqXHR, statusText, error) {
				console.log('error');
				console.log(statusText.responseText);
			}
		});
	},

	parse: function(response) {
		return response.types;
	}

});



// authors collection
App.Collections.Authors = Backbone.Collection.extend({
	model: App.Models.Author,

	url: PM_Ajax.ajaxurl,

	initialize: function() {
		if(PM_Ajax.collections.authors) {
			this.add(jQuery.parseJSON(PM_Ajax.collections.authors));
		} else {
			this.queryAuthors();
		}
	},

	queryAuthors: function() {
		this.fetch({
			data: {
				action: 'ajax-PMgetData',
				paramsNonce: PM_Ajax.paramsNonce,
				request: 'getAuthors'
			},

			type: 'POST',

			success: function(collection, object, jqXHR) {
				console.log(object);
				var authorsView = new App.Views.Authors({ collection: collection });
				jQuery('#wpbody-content nav #authors').replaceWith(authorsView.render().el);
			},

			error: function(jqXHR, statusText, error) {
				console.log('error');
				console.log(statusText.responseText);
			}
		});
	},

	parse: function(response) {
		return response;
	}

});



// post collection
App.Collections.Posts = Backbone.Collection.extend({
	model: App.Models.Post,

	url: PM_Ajax.ajaxurl,

	initialize: function() {
		if(PM_Ajax.collections.posts && window.App.State == 'initial') {
			this.add(jQuery.parseJSON(PM_Ajax.collections.posts));
		} else {
			this.queryPosts();
		}
	},

	queryPosts: function() {
		this.fetch({
			data: {
				action: 'ajax-PMgetData',
				paramsNonce: PM_Ajax.paramsNonce,
				vars: App.Query.toJSON(),
				request: 'getPosts'
			},

			type: 'POST',

			success: function(collection, object, jqXHR) {
				console.log(object);
				var postsView = new App.Views.Posts({ collection: collection });
				jQuery('#wpbody-content section ul#posts').replaceWith(postsView.render().el);
				jQuery('#wpbody-content section ul#posts li:first-child h3').click();

				if (0 === object.length) {
					jQuery('#wpbody-content section article').html('<h3>No posts available.</h3>');
				}
			},

			error: function(jqXHR, statusText, error) {
				console.log('error');
				console.log(statusText.responseText);
			}
		});
	},

	parse: function(response) {
		return response;
	}

});



// taxonomies collection
App.Collections.Taxonomies = Backbone.Collection.extend({
	model: App.Models.Taxonomy,

	url: PM_Ajax.ajaxurl,

	initialize: function() {
		if(PM_Ajax.collections.taxonomies) {
			this.add(jQuery.parseJSON(PM_Ajax.collections.taxonomies));
		} else {
			this.queryTaxonomies();
		}
	},

	queryTaxonomies: function() {
		this.fetch({
			data: {
				action: 'ajax-PMgetData',
				paramsNonce: PM_Ajax.paramsNonce,
				post_type: App.Query.get('post_type'),
				request: 'getTerms'
			},

			type: 'POST',

			success: function(collection, object, jqXHR) {
				console.log(object);
				var taxView = new App.Views.Taxonomies({ collection : collection });
				jQuery('#wpbody-content nav #SelectTax').replaceWith(taxView.render().el);
			},

			error: function(jqXHR, statusText, error) {
				console.log('error');
				console.log(statusText.responseText);
			}
		});
	},

	parse: function(response) {
		console.log(response);
		// _.each(response, function(tax) {
		// 	tax.terms = new App.Collections.Terms(tax.terms);
		// });
		//
		return response;
	}

});
