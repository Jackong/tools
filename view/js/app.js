define([
    'angular',
    'configs',
    'controllers',
    'services',
    'filters'
], function (angular) {
    'use strict';

    // Declare app level module which depends on filters, and services

    return angular.module('seed', [
        'seed.configs',
        'seed.controllers'
    ]);
});
