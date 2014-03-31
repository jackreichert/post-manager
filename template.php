<section>
	<header>
		<h2>Manage Posts</h2>

		<div id="postSearch">
			<input type="search" placeholder="Search">
			<button class="button">Search</button>
		</div>
		<nav>
			<ul id="types" class="tabs"></ul>
		</nav>
	</header>
	<div role="main">
		<nav>
			<button class="button authors">Authors</button>
			<ul id="SelectTax"></ul>

			<div id="authors" class="tab-pane">
				<ul></ul>
			</div>
			<div id="taxonomies">
				<ul></ul>
			</div>
		</nav>

		<ul id="posts"></ul>
		<article id="postContent"></article>
	</div>
</section>

<script id="post-template" type="text/x-handlebars-template">
	<h3>{{{post_title}}}</h3>
	<address class="author">by <span rel="author">{{author_display_name}}</span></address>
	<time datetime="{{datetime}}">{{the_time}}</time>
	<div class="manage-icons">
		<i class="dashicons dashicons-visibility"></i>
		<i class="dashicons dashicons-edit"></i>
		<i class="dashicons dashicons-trash"></i>
	</div>
</script>

<script id="postContent-template" type="text/x-handlebars-template">
	<h1 class="post_title">{{{post_title}}}</h1>
	<hr>
<!--	{{#term_list}}
		{{taxonomy}} : {{name}}<br>
	{{/term_list}} -->
	<div class="meta"></div>
	<div class="post_content">{{{post_content}}}</div>
</script>

<script id="author-template" type="text/x-handlebars-template">
	{{{avatar}}}

	<h4>{{display_name}}</h4>
	<p>Total posts <span>{{post_count}}</span></p>
</script>

<script id="types-template" type="text/x-handlebars-template">
		<a href="#type-{{slug}}">{{label}}</a>
</script>

<script id="taxonomy-template" type="text/x-handlebars-template">
		<a href="#taxonomy-{{slug}}">{{name}}</a>
</script>

<script id="term-template" type="text/x-handlebars-template">
		<a href="#term-{{slug}}">{{name}}</a>
</script>
