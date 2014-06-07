define([
	'angular',
	'angularRoute',
    'angularResource',
    'controllers'
], function (angular, controllers) {
		'use strict';

		// Declare app level module which depends on filters, and services
		
		return angular.module('iWomen', [
			'ngRoute',
			'controllers'
		]);
});
