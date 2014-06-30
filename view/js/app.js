define([
	'angular',
	'angularRoute',
    'angularResource',
    'angularMd5',
    'ngTagsInput'
], function (angular) {
		'use strict';

		// Declare app level module which depends on filters, and services
		
		return angular.module('iWomen', [
			'ngRoute',
            'ngResource',
            'angular-md5',
            'bootstrap-tagsinput'
		]);
});
