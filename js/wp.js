function WP($http) {
  var WP = {
    categories: []
  };
  WP.getAllCategories = function() {
    if (WP.categories.length) {
      return;
    }
    return $http.get('wp-json/taxonomies/category/terms').success(function(res){
      WP.categories = res;
    });
  };
  return WP;
}
app.factory('WP', ['$http', WP]);