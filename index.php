<!DOCTYPE html>
<html ng-app="spe">
<head>
  <base href="<?php $url_info = parse_url( home_url() ); echo trailingslashit( $url_info['path'] ); ?>">
  <meta name="viewport" content="width=device-width">
  <title>SPE</title>
  <?php wp_head(); ?>
</head>
<body>
  <div ng-include src="'<?php echo get_template_directory_uri(); ?>/views/top-bar.html'"></div>
  <div ng-view></div>
  <?php wp_footer(); ?>
</body>
</html>