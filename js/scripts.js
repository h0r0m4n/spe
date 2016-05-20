var app = angular.module('spe', [
  "ngRoute",
  "ngSanitize",
  "mm.foundation",
  "ngAnimate"
]);

// Routes
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  // https://docs.angularjs.org/tutorial/step_07
  $routeProvider
  .when('/', {
    templateUrl: myLocalized.views + 'home.html',
    controller: 'Home'
  })
  .when('/category/:category/', {
    templateUrl: myLocalized.views + 'home.html',
    controller: 'Category'
  })
  .when('/category/:category/page/:page', {
    templateUrl: myLocalized.views + 'home.html',
    controller: 'Category'
  })
  .when('/page/:page', {
    templateUrl: myLocalized.views + 'home.html',
    controller: 'Paged'
  })
  .when('/blog/:slug', {
    templateUrl: myLocalized.views + 'single.html',
    controller: 'Single'
  })
  .when('/:slug', {
    templateUrl: myLocalized.views + 'page.html',
    controller: 'Page'
  })
  .otherwise({
    templateUrl: myLocalized.views + '404.html',
    controller: '404'
  });
}]);

// Top Bar
app.controller('TopBarCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get('wp-json').success(function(res) {
    $scope.site = res;
  });
  $http.get('wp-json/pages/').success(function(res){
    $scope.pages = res;
  });
}]);

// Home
app.controller('Home', ['$scope', '$http', 'WP', function($scope, $http, WP) {
  WP.getAllCategories();
  $scope.data = WP;
  $http.get('wp-json/posts/').success(function(res, status, headers){
    $scope.posts = res;
    document.querySelector('title').innerHTML = 'SPE';
    $scope.currentPage = 1;
    $scope.totalPages = headers('X-WP-TotalPages'); // magic
  });
  $http.get('wp-json/taxonomies/category/terms').success(function(res){
    $scope.taxonomies = res;
  });
}]);

// Single
app.controller('Single', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  $http.get('wp-json/posts/?filter[name]=' + $routeParams.slug).success(function(res){
    $scope.post = res[0];
    document.querySelector('title').innerHTML = res[0].title + ' | SPE';
  });
}]);

// Page
app.controller('Page', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  $http.get('wp-json/pages/?filter[name]=' + $routeParams.slug).success(function(res){
    $scope.page = res[0];
    document.querySelector('title').innerHTML = res[0].title + ' | SPE';
  });
}]);

// Category
app.controller('Category', ['$scope', '$location', '$routeParams', '$http', 'WP', function($scope, $location, $routeParams, $http, WP) {
  WP.getAllCategories();
  $scope.data = WP;
  $http.get('wp-json/taxonomies/category/terms/?filter[slug]=' + $routeParams.category).success(function(res){
    if (!res.length) {
      document.querySelector('title').innerHTML = '404 | SPE';
    } else {
      $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
      };
      $scope.current_category_id = res[0].ID;
      var currentPage = ( ! $routeParams.page ) ? 1 : parseInt( $routeParams.page );
      document.querySelector('title').innerHTML = res[0].name + ' | SPE';
      var request = 'wp-json/posts/?filter[category_name]=' + res[0].name;
      if ( $routeParams.page ) {
        request += '&page=' + currentPage;
      }
      $http.get(request).success(function(res, status, headers){
        if ( $routeParams.page && ( isNaN(currentPage) || currentPage > headers('X-WP-TotalPages') ) ) {
          document.querySelector('title').innerHTML = '404 | SPE';
        } else {
          $scope.posts = res;
          $scope.currentPage = currentPage;
          $scope.totalPages = headers('X-WP-TotalPages');
        }
      });
    }
  });
}]);

// Page 1 of 2
app.controller('Paged', ['$scope', '$routeParams', '$http', 'WP', function($scope, $routeParams, $http, WP) {
  WP.getAllCategories();
  $scope.data = WP;
  $http.get('wp-json/posts/?page=' + $routeParams.page).success(function(res, status, headers){
    var currentPage = parseInt($routeParams.page);
    if ( isNaN(currentPage) || currentPage > headers('X-WP-TotalPages') ) {
      document.querySelector('title').innerHTML = '404 | SPE';
    } else {
      $scope.currentPage = currentPage;
      $scope.totalPages = headers('X-WP-TotalPages');
      $scope.posts = res;
      document.querySelector('title').innerHTML = 'Page ' + $scope.currentPage + ' | SPE';
    }
  });
}]);

// Search
app.directive('searchForm', function() {
  return {
    restrict: 'EA',
    template: '<input type="text" placeholder="Search" name="s" ng-model="filter.s" ng-change="search()">',
    controller: ['$scope', '$http', function ( $scope, $http ) {
      $scope.filter = {
        s: ''
      };
      $scope.search = function() {
        $http.get('wp-json/posts/?filter[s]=' + $scope.filter.s + '&filter[posts_per_page]=-1').success(function(res){
          $scope.posts = res;
          $scope.currentPage = 1;
          $scope.totalPages = 1;
        });
      };
    }]
  };
});

// Pagination
app.directive('postsNavLink', function() {
  return {
    restrict: 'EA',
    templateUrl: myLocalized.views + 'posts-nav-link.html',
    controller: ['$scope', '$element', '$routeParams', function( $scope, $element, $routeParams ){
      var currentPage = ( ! $routeParams.page ) ? 1 : parseInt( $routeParams.page ),
      linkPrefix = ( ! $routeParams.category ) ? 'page/' : 'category/' + $routeParams.category + '/page/';
      $scope.postsNavLink = {
        prevLink: linkPrefix + ( currentPage - 1 ),
        nextLink: linkPrefix + ( currentPage + 1 ),
        sep: ( ! $element.attr('sep') ) ? '|' : $element.attr('sep'),
        prevLabel: ( ! $element.attr('prev-label') ) ? 'Previous Page' : $element.attr('prev-label'),
        nextLabel: ( ! $element.attr('next-label') ) ? 'Next Page' : $element.attr('next-label')
      };
    }]
  };
});

// 404 error
app.controller('404', function() {
  document.querySelector('title').innerHTML = '404 | SPE';
});