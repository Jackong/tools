/**
 * Created by daisy on 14-6-4.
 */
define(['app'], function (app) {
    'use strict';

    return app.factory('Look', function ($resource) {
        return $resource('api/looks/:type')
    });
});
