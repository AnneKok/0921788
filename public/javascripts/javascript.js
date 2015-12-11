var app = angular.module('Assignment2', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-form', {
            templateUrl: 'partials/add-form.html'
        })
        .when('/add-form', {
            templateUrl: 'partials/add-form.html',
            controller: 'AddVideoCtrl'
        })
        .when('/video/:id', {
          templateUrl: 'partials/add-form.html',
          controller: 'EditVideoCtrl'
        })
        .when('/video/delete/:id', {
          templateUrl: 'partials/delete.html',
          controller: 'DeleteVideoCtrl'
        })
        .when('/about', {
          templateUrl: 'partials/about.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource',
    function($scope, $resource){
      var Players = $resource('/api/videos');
      /* Run some jQuery when all database items have been retrieved */
      $scope.$on('onRepeatLast', function(scope, element, attrs) {
//
      });
      Players.query(function(videos){
          $scope.videos = videos;
      });
    }
]);

app.controller('AddVideoCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Videos = $resource('/api/videos');
            Videos.save($scope.video, function(){
                $location.path('/');
            });
        };
    }
]);

app.controller('EditVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Videos = $resource('/api/videos/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Videos.get({ id: $routeParams.id }, function(video){
            $scope.video = video;
        });

        $scope.save = function(){
            Videos.update($scope.video, function(){
                $location.path('/');
            });
        }
    }
]);

app.controller('DeleteVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Videos = $resource('/api/videos/:id');

        Videos.get({ id: $routeParams.id }, function(video){
            $scope.video = video;
        })

        $scope.delete = function(){
            Videos.delete({ id: $routeParams.id }, function(video){
                $location.path('/');
            });
        }
    }
]);

/* Directive to ensure correct tab selection, I could not use a click
*  handler since this does not handle backward or forward in the browser.
*  When a link is clicked only the partial is changed, so I needed to detect
*  the URL in order to find out which partial (page) is active.
*/
app.directive('navigation', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attribute) {
      var loc = window.location.href;
      if(/about/.test(loc)) {
        $(".menu").removeClass("active");
        $("#about").addClass("active");
      } else
      if(/add-form/.test(loc)) {
        $(".menu").removeClass("active");
        $("#add").addClass("active");
      } else
      if(/video/.test(loc)) {
        $(".menu").removeClass("active");
        $("#add").addClass("active");
      } else {
        $(".menu").removeClass("active");
        $("#home").addClass("active");
      }
    }
  };
});

/* Directive to check when last database item has been retrieved */
app.directive('onLastRepeat', function() {
  return function(scope, element, attrs) {
    if (scope.$last) setTimeout(function() {
      scope.$emit('onRepeatLast', element, attrs);
    }, 1);
  };
});
