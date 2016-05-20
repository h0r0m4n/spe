<?php

function my_scripts() {

  wp_register_script(
    'angularjs',
    get_stylesheet_directory_uri() . '/bower_components/angular/angular.min.js'
  );

  wp_register_script(
    'angularjs-route',
    get_stylesheet_directory_uri() . '/bower_components/angular-route/angular-route.min.js'
  );

  wp_register_script(
    'angularjs-sanitize',
    get_stylesheet_directory_uri() . '/bower_components/angular-sanitize/angular-sanitize.min.js'
  );

  wp_register_script(
    'angular-foundation',
    get_stylesheet_directory_uri() . '/bower_components/angular-foundation/mm-foundation-tpls.min.js'
  );

  wp_register_script(
    'angular-animate',
    'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.14/angular-animate.min.js'
    //get_stylesheet_directory_uri() . '/bower_components/angular-animate/angular-animate.min.js'
  );

  wp_enqueue_script(
    'my-scripts',
    get_stylesheet_directory_uri() . '/js/scripts.min.js',
    array( 'angularjs', 'angularjs-route', 'angularjs-sanitize', 'angular-foundation', 'angular-animate')
  );

  wp_enqueue_script(
    'wp',
    get_stylesheet_directory_uri() . '/js/wp.min.js'
  );

  wp_enqueue_style(
    'google-fonts',
    'http://fonts.googleapis.com/css?family=Roboto:400,400italic,700|Roboto+Mono:400,700'
  );

  wp_enqueue_style(
    'theme-css',
    get_stylesheet_directory_uri() . '/style.css'
  );

  wp_localize_script(
    'my-scripts',
    'myLocalized',
    array(
      'views' => trailingslashit( get_template_directory_uri() ) . 'views/'
      )
  );
}
add_action( 'wp_enqueue_scripts', 'my_scripts' );

function my_add_link_target( $html ) {

  $html = preg_replace( '/(<a.*")>/', '$1 target="_self">', $html );
  return $html;
}
add_filter( 'image_send_to_editor', 'my_add_link_target', 10 );

add_filter( 'query_vars', function( $query_vars ) {
  $query_vars[] = 'post_parent';
  return $query_vars;
});

// add_filter('show_admin_bar', '__return_false');

function my_theme_setup() {

  add_theme_support( 'post-thumbnails' );

  add_image_size( 'square', 640, 640, true );
  add_image_size( 'xl', 640 );
  add_image_size( 'xxl', 1280 );
  add_image_size( 'xxxl', 1920 );
}
add_action( 'after_setup_theme', 'my_theme_setup' );