<?php
/**
 * Plugin Name: Posts Manager
 * Plugin URI:
 * Description: Rethinking "Posts" management
 * Version: 0.1
 * Author: jackreichert
 * Author URI: http://www.jackreichert.com
 * License: GPL2
 */

 $posts_manager = new PostsManager();

 Class PostsManager {
    // holds the query
    private $query_vars;

    public function __construct(){
        add_action( 'admin_menu', array($this, 'menu') );
        add_action( 'admin_enqueue_scripts', array($this, 'admin_scripts') );
        add_action( 'wp_ajax_ajax-PMgetData', array($this, 'getData') );
        add_action( 'wp_ajax_ajax-PMgetPosts', array($this, 'getPosts') );
        add_action( 'wp_ajax_ajax-PMgetAuthors', array($this, 'getAuthors') );
        add_action( 'wp_ajax_ajax-PMgetTypes', array($this, 'getTypes') );
        add_action( 'wp_ajax_ajax-PMgetTerms', array($this, 'getTerms') );
        $this->query_vars = array(
            'posts_per_page' => 20,
            'post_author' => '',
            'post_type' => 'post'
        );
    }

    public function menu() {
        add_menu_page( 'Posts Manager', 'Posts Manager', 'edit_posts', 'posts-manager', array($this, 'posts_manager_page'), '', 3 );
    }

    public function admin_scripts() {
        if (isset($_GET['page']) && 'posts-manager' === $_GET['page']) {
            $current_user = wp_get_current_user();

            wp_enqueue_style( 'posts-manager-css', plugin_dir_url( __FILE__ ) . '/css/posts-manager.css' );
            wp_enqueue_script('jquery');
            wp_enqueue_script('underscore');
            wp_enqueue_script('backbone', array('underscore', 'jquery'));
            wp_enqueue_script( 'handlebars', plugin_dir_url( __FILE__ ) . '/js/libs/handlebars-v1.3.0.js', array('jquery') );
            wp_enqueue_script( 'posts-manager-js', plugin_dir_url( __FILE__ ) . '/js/posts-manager.js', array('jquery','handlebars', 'backbone'), '0.1', true );
            wp_localize_script( 'posts-manager-js', 'PM_Ajax',
                array(
                    'ajaxurl'       => admin_url( 'admin-ajax.php' ),
                    'paramsNonce'   => wp_create_nonce( 'pm-paramsNonce' ),
                    'adminurl'		  => admin_url(),
                    'collections'   => array (
                        'types'         => json_encode($this->getTypes()),
                        'authors'       => json_encode($this->getAuthors()),
                        'taxonomies'    => json_encode($this->getTerms()),
                        'posts'         => json_encode($this->getPosts()),
                        'query'         => json_encode($this->query_vars)
                    )
                )
            );
            wp_enqueue_script( 'pm-models-js', plugin_dir_url( __FILE__ ) . '/js/models.js', array('jquery','handlebars', 'backbone', 'posts-manager-js'), '0.1', true );
            wp_enqueue_script( 'pm-collections-js', plugin_dir_url( __FILE__ ) . '/js/collections.js', array('jquery','handlebars', 'backbone', 'posts-manager-js', 'pm-models-js'), '0.1', true );
            wp_enqueue_script( 'pm-views-js', plugin_dir_url( __FILE__ ) . '/js/views.js', array('jquery','handlebars', 'backbone', 'posts-manager-js', 'pm-models-js', 'pm-collections-js'), '0.1', true );
            wp_enqueue_script( 'pm-router-js', plugin_dir_url( __FILE__ ) . '/js/router.js', array('jquery','handlebars', 'backbone', 'posts-manager-js', 'pm-models-js', 'pm-collections-js', 'pm-views-js'), '0.1', true );

        }
    }

    protected function getQuery($vars = array()) {
        // if $_POST sanitize
        if ( 0 < count($vars) ) {
            $this->query_vars = array(
                'posts_per_page' => ( 0 < intval($vars['posts_per_page'])) ? intval($vars['posts_per_page']) : $this->query_vars['posts_per_page'],
                'post_author'    => (ctype_digit(preg_replace('/[\s,]+/', '', $vars['post_author'])) || '' === $vars['post_author']) ? $vars['post_author'] : $this->query_vars['post_author'],
                'post_type'      => wp_kses($vars['post_type'], array())
            );

        }

        return $this->query_vars;
    }

    public function getData() {
        $nonce = isset($_POST['paramsNonce']) ? $_POST['paramsNonce'] : false;
        if ( $nonce && ! wp_verify_nonce( $nonce, 'pm-paramsNonce' ) ) {
            die ( 'Busted!');
        }

        $request = wp_kses($_POST['request'], array());
        $results = call_user_func(array($this, $request));

        header('Content-type: application/json');
        echo json_encode($results);
        exit();
    }

    public function getTerms() {
        $taxonomies = get_object_taxonomies($this->query_vars['post_type'], 'object');

        $terms = get_terms(array_keys($taxonomies));

        $term_model = $tax_model = array();
        foreach($terms as $term) {
            $term_model[$term->taxonomy][] = array(
                'term_id'    => $term->term_id,
                'name'       => $term->name,
                'slug'       => $term->slug,
                'taxonomy'   => $term->taxonomy
            );
        }

        foreach($taxonomies as $key => $taxonomy) {
            if ( isset($term_model[$key]) && 0 < count($term_model[$key]) ) {
            $tax_model[] = array(
                    'assoc'    => $taxonomy->object_type,
                    'name'     => $taxonomy->labels->singular_name,
                    'plural'   => $taxonomy->labels->name,
                    'slug'     => $key,
                    'terms'    => isset($term_model[$key]) ? $term_model[$key] : array()
                );
            }
        }

        return $tax_model;
    }

    public function getTypes() {
        $args = array(
            'public'   => true
        );
        $post_types = get_post_types($args, 'objects');

        $types = array();
        foreach($post_types as $type) {
            $types[] = array('name' => $type->name, 'label' => $type->label);
        }

        return $types;

    }

    public function getAuthors( $post_type = 'post' ) {

        $type = isset($_POST['post_type']) ? wp_kses($_POST['post_type'], array()) : $post_type;

        global $wpdb;
        $author_ids = $wpdb->get_col($wpdb->prepare("SELECT DISTINCT post_author FROM {$wpdb->posts} WHERE post_type = %s ORDER BY post_date DESC;", $type));
        $args = array( 'include' => $author_ids, 'fields' => 'all_with_meta' );

        $authors = array(
            array(
                'ID' 			  => 'all',
                'display_name' 	=> 'All Authors',
                //'post_count'	   => wp_count_posts($type, 'readble')
            )
        );
        foreach (get_users($args) as $author) {
            $authors[] = array(
                'ID' 			=> $author->ID,
                'display_name'   => $author->display_name,
                'roles'  		=> $author->roles[0],
                'avatar' 		=> get_avatar($author->ID, 48),
                'post_count' 	=> count_user_posts($author->ID)
            );
        }

    // echo '<pre>';
    // var_dump($authors);
    // die();

        return $authors;

    }

    public function getPosts() {
        $vars = isset($_POST['vars']) ? $this->getQuery($_POST['vars']) : $this->getQuery();

        $args = array(
            'author'		   => $vars['post_author'],
            'posts_per_page'   => $vars['posts_per_page'],
            'post_status'      => 'any',
            'orderby'          => 'post_date',
            'order'            => 'DESC',
            'post_type'        => $vars['post_type']
        );

        $taxonomy_names = get_object_taxonomies( $args['post_type'] );

        $the_query = new WP_Query($args);
        $data = array();
        $i = 0;
        if ( $the_query->have_posts() ) {
            while ( $the_query->have_posts()) {
                $the_query->the_post();
                global $post;
                $data[$i]['ID'] = get_the_ID();
                $data[$i]['post_type'] = get_post_type();
                $data[$i]['post_author'] = get_the_author_meta('ID');
                $data[$i]['author_display_name'] = get_the_author();
                $data[$i]['post_title'] = get_the_title();
                $data[$i]['post_content'] = wpautop(get_the_content());
                $data[$i]['the_time'] = $this->formatDate($post);
                $data[$i]['datetime'] = get_the_date( 'Y-m-d' );
                $data[$i]['term_list'] = wp_get_post_terms(get_the_ID(), $taxonomy_names, array("fields" => "all"));
                $data[$i]['post_status'] = get_post_status();

                $i++;
            }
        }
        wp_reset_postdata();

        return $data;
    }

    public function posts_manager_page() {
        include('template.php');
    }

    public function formatDate($post) {
        if ( '0000-00-00 00:00:00' == $post->post_date ) {
            $t_time = $h_time = __( 'Unpublished' );
            $time_diff = 0;
        } else {
            $t_time = get_the_time( __( 'Y/m/d g:i:s A' ) );
            $m_time = $post->post_date;
            $time = get_post_time( 'G', true, $post );

            $time_diff = time() - $time;

            if ( $time_diff > 0 && $time_diff < DAY_IN_SECONDS ) {
                $h_time = sprintf( __( '%s ago' ), human_time_diff( $time ) );
            } else {
                $h_time = mysql2date( __( 'Y/m/d' ), $m_time );
            }
        }
        return $h_time;
    }

 }
