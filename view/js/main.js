require.config({
	paths: {
		angular: 'libs/angular/angular',
        angularRoute: 'libs/angular-route/angular-route',
		angularResource: 'libs/angular-resource/angular-resource',
        angularMd5: 'libs/angular-md5/angular-md5',
        angularFlow: 'libs/ng-flow/src/angular-flow',
        ngTagsInput: 'libs/bootstrap-tagsinput/dist/bootstrap-tagsinput-angular'
    },
	shim: {
        angular : {exports : 'angular'},
        angularRoute: ['angular'],
        angularResource: ['angular'],
        angularMd5: {
            deps: ['angular']
        },
        ngTagsInput: {
            deps: [
                'angular',
                'libs/bootstrap-tagsinput/dist/bootstrap-tagsinput.min'
            ]
        }
	},
	priority: [
		"angular"
	],
    urlArgs: "version=" + (new Date()).getTime()
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
	'angular',
	'app',
	'routes'
], function(angular, app) {
	'use strict';
    window.angular = angular;
	angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		angular.resumeBootstrap([app['name']]);
	});
});
