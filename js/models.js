// query model
App.Models.Query = Backbone.Model.extend({
	defaults: {
		post_author		: '',
		post_type 		: 'post',
		posts_per_page 	: 20
	}
});



// post type model
App.Models.Type = Backbone.Model.extend({
	name: 'post',
	label: 'Post'
});



// author model
App.Models.Author = Backbone.Model.extend({
	defaults: {
		avatar: '<img alt="" src="http://1.gravatar.com/avatar/ad516503a11cd5ca435acc9bb6523536%3Fs%3D48" class="avatar avatar-48 photo" height="48" width="48">',

		display_name: 'Mr. WordPress',

		post_count: 0

	}
});



// post model
App.Models.Post = Backbone.Model.extend({
	defaults: {
		ID: 1,
		post_type: "post",
		author_display_name: "admin",
		post_title: "Hello World!",
		post_content: "<p>Welcome to WordPress. This is your first post. Edit or delete it, then start blogging!</p>"
	}
});


App.Models.Term = Backbone.Model.extend({
	defaults: {
		term_id: 1,
		name: 'Uncategorized',
		slug: 'uncategorized',
		taxonomy: 'category'
	}
});

App.Models.Taxonomy = Backbone.Model.extend({
	defaults: {
		assoc: ['post'],
		name: 'Category',
		plural: 'Categories',
		slug: 'category',
		terms: [new App.Models.Term()]
	}
});
