/**
 * Created by daisy on 14-7-31.
 */
define(['angular', 'services', 'services/look'], function (angular) {
    angular.module('iWomen.controllers.mine', ['iWomen.services', 'iWomen.services.look'])
        .controller('WantsCtrl', function ($scope, LookService) {
            LookService.setType('wants');
        })
        .controller('LikesCtrl', function ($scope, LookService) {
            LookService.setType('likes');
        })
        .controller('TipsCtrl', function ($scope, LookService) {
            LookService.setType('tips');
        });
});