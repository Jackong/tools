/**
 * Created by daisy on 14-6-4.
 */

angular.module('iWomen', ['ngRoute', 'ngResource', 'accountService'])
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller:'AppCtrl',
            templateUrl:'html/app.html'
        })
        .when('/sign', {
            controller:'SignCtrl',
            templateUrl:'html/sign.html'
        })
        .when('/where2get', {
            controller:'Where2GetCtrl',
            templateUrl:'html/where2get.html'
        })
        .when('/mine', {
            controller: 'MineCtrl',
            templateUrl: 'html/mine.html'
        })
        .otherwise({
            redirectTo:'/'
        });
})
.controller('AppCtrl', function ($location, Account) {
        //var account = Account.query();
        $location.path('/where2get');
})
.controller('SignCtrl', function ($scope, $location) {

})
.controller('Where2GetCtrl', function ($scope) {

});