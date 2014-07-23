require.config({
	paths: {
		angular: [
            'http://cdn.bootcss.com/angular.js/1.2.16/angular.min',
            'libs/angular/angular'
        ],
        angularRoute: [
            'http://cdn.bootcss.com/angular.js/1.2.16/angular-route.min',
            'libs/angular-route/angular-route'
        ],
		angularResource: [
            'http://cdn.bootcss.com/angular.js/1.2.16/angular-resource.min',
            'libs/angular-resource/angular-resource'
        ],
        angularMd5: 'libs/angular-md5/angular-md5',
        ngTagsInput: 'libs/bootstrap-tagsinput/dist/bootstrap-tagsinput-angular',
        ngTagsInputOrigin: 'libs/bootstrap-tagsinput/dist/bootstrap-tagsinput.min',
        jquery: [
            'http://cdn.bootcss.com/jquery/1.10.2/jquery.min',
            'libs/jquery/jquery.min'
        ],
        bootstrap: [
            'http://cdn.bootcss.com/twitter-bootstrap/3.0.3/js/bootstrap.min',
            'libs/bootstrap/dist/js/bootstrap.min'
        ],
        socialLogin: "http://openapi.baidu.com/social/oauth/2.0/connect/login?redirect_uri="
            + encodeURIComponent("http://192.168.59.103/api/social/oauth/callback")
            + "&domid=social-login&client_type=web&response_type=code&media_types=sinaweibo%2Cqqdenglu%2Cbaidu%2Cqqweibo%2Ckaixin%2Crenren&size=-1&button_type=1&client_id=2o6HoeD4IBHsXTQWd023VLTh&view=embedded&t=" + new Date().getTime()
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
                'ngTagsInputOrigin'
            ]
        },
        ngTagsInputOrigin: {
            deps: [
                'bootstrap'
            ]
        },
        jquery: {exports: '$'},
        bootstrap: {
            deps: ['jquery']
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
    'bootstrap',
	'app'
], function(angular, bootstrap, app) {
	'use strict';
    window.angular = angular;
	angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		angular.resumeBootstrap([app['name']]);
	});
});
