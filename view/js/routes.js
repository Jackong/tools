define(['angular', 'app'], function(angular, app) {
	'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
            .when('/', {
                templateUrl: 'partials/app.html',
                controller: 'AppCtrl'
		    })
            .when('/sign', {
                templateUrl: 'partials/sign.html',
                controller: 'SignCtrl'
		    })
            .when('/mine', {
                templateUrl: 'partials/mine.html',
                controller: 'MineCtrl'
            })
            .when('/where2get', {
                templateUrl: 'partials/where2get.html',
                controller: 'Where2GetCtrl'
            })
            .otherwise({redirectTo: '/'});
	}]);

});