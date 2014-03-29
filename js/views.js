// page view
App.Views.App = Backbone.View.extend({
	el: '#wpbody-content',

	initialize: function() {
		var query = (PM_Ajax.collections.query) ? PM_Ajax.collections.query : {};
		App.Query = new App.Models.Query({ model: query });
		var postsCollection = new App.Collections.Posts();
	},

	events: {
		'click nav .authors.button': 'getAuthors'
	},

	getAuthors: function() {
		jQuery('.tab-pane').toggle();
	},

	getTypes: function() {

	}

});



// type view
App.Views.Type = Backbone.View.extend({
	tagName: 'li',

	className: function() {
		if (this.model.get('name') == App.Query.get('post_type')) {
			return 'post_type isActive';
		} else {
			return 'post_type';
		}
	},

	template: App.Templates.type,

	render: function() {
		this.$el.html(this.template(this.model.toJSON()))
			.attr('id', 'type-' + this.model.get('name'));

		return this;
	},

	events: {
		'click' : 'filterByType'
	},

	filterByType : function(e) {
		e.preventDefault();
		this.$el.siblings().removeClass('isActive');
		this.$el.addClass('isActive');
		App.Query.set({ post_type : this.model.get('name') });
		var postsCollection = new App.Collections.Posts();
	}
});



// all types
App.Views.Types = Backbone.View.extend({
	tagName: 'ul',

	id: 'SelectType',

	className: 'tabs',

	render: function() {
		this.collection.each(this.addType, this);
		return this;
	},

	addType: function(type) {
		var typeView = new App.Views.Type({ model: type });
		this.$el.append(typeView.render().el);
	}

});





// author view
App.Views.Author = Backbone.View.extend({
	tagName: 'li',

	className: 'author',

	events: {
		'click': 'filterAuthor'
	},

	template: App.Templates.author,

	render: function() {
		this.$el.html(this.template(this.model.toJSON()))
			.attr('id', 'author-' + this.model.get('ID'));
		return this;
	},

	filterAuthor: function(e) {
		var author_id = (jQuery(e.target).is('li')) ? jQuery(e.target).attr('id') : jQuery(e.target).closest('li').attr('id');

		console.log(author_id);
		if (typeof author_id === 'string') {
			App.Query.set('post_author', author_id.split('-')[1]);
			var postsCollection = new App.Collections.Posts();
		}
	}

});

// all authors
App.Views.Authors = Backbone.View.extend({
	tagName: 'ul',

	id: 'SelectAuthors',

	render: function() {
		this.collection.each(this.addAuthor, this);
		return this;
	},

	addAuthor: function(author) {
		var authorView = new App.Views.Author({ model: author });
		this.$el.append(authorView.render().el);
	}
});



// post list item view
App.Views.PostListItem = Backbone.View.extend({
	tagName: 'li',

	className: 'post-heading',

	template: App.Templates.postListItem,

	events: {
		'click h3, .dashicons-visibility': 'loadArticle',
		'click [rel=author]': 'filterAuthor'
	},

	loadArticle: function(elem) {
		var postArticle = new App.Views.PostArticle({ model: this.model });
		jQuery('#wpbody-content section li.active').removeClass('active');
		this.$el.addClass('active');
		jQuery('#wpbody-content section article').replaceWith(postArticle.render().el);
		jQuery('#wpbody-content section [role=main]').css({ background: this.$el.css('background-color') })
	},

	filterAuthor: function(elem) {
		App.Query.set('post_author', this.model.get('post_author'));
		var postsCollection = new App.Collections.Posts();
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()))
			.attr('id', this.model.get('post_type') + '-' + this.model.get('ID'));
		return this;
	}
});

// post article view
App.Views.PostArticle = Backbone.View.extend({
	tagName: 'article',

	className: 'content-main',

	template: App.Templates.postArticle,

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

});

// post collection view
App.Views.Posts = Backbone.View.extend({
	tagName: 'ul',

	id: 'posts',

	initialize: function() {
		this.render();
		window.App.State = 'loaded';
	},

	render: function() {
		this.collection.each(this.addPost, this);
		return this;
	},

	addPost: function(post) {
		var postView = new App.Views.PostListItem({ model: post });
		this.$el.append(postView.render().el);
	}

});



// taxnonomy article view
App.Views.Taxonomy = Backbone.View.extend({
	tagName: 'li',

	className: 'taxonomy button',

	template: App.Templates.taxonomy,

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

});

// all authors
App.Views.Taxonomies = Backbone.View.extend({
	tagName: 'ul',

	id: 'SelectTax',

	render: function() {
		this.collection.each(this.addTax, this);
		return this;
	},

	addTax: function(tax) {
		var authorView = new App.Views.Taxonomy({ model: tax });
		this.$el.append(authorView.render().el);
	}
});

// taxnonomy article view
App.Views.Term = Backbone.View.extend({
	tagName: 'li',

	className: 'term button',

	template: App.Templates.term,

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

});

// all terms
App.Views.Terms = Backbone.View.extend({
	tagName: 'ul',

	id: 'SelectTerm',

	render: function() {
		this.collection.each(this.addTerm, this);
		return this;
	},

	addTerm: function(term) {
		var termViews = new App.Views.Term({ model: term });
		this.$el.append(termViews.render().el);
	}
});
