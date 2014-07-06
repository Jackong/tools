/**
 * Created by daisy on 14-7-5.
 */
define(['angular'], function (angular) {
    'use strict';

    return angular.module('iWomen.filters', [])
        .filter('formatTime', [function() {
            var now = Date.now();
            return function(time) {
                var seconds = (now - time) / 1000;
                if (seconds < 60) {
                    return '刚刚';
                }
                if (seconds < 60 * 60) {
                    return parseInt(seconds / 60) + '分钟前';
                }
                if (seconds < 24 * 60 * 60) {
                    return parseInt(seconds / (60 * 60)) + '小时前';
                }
                if (seconds < 48 * 60 * 60) {
                    return '昨天';
                }
                if (seconds < 96 * 60 * 60) {
                    return '前天';
                }
                var date = new Date(time);
                return date.getFullYear() + '年' + date.getMonth() + '月' + date.getDate();
            }
        }])
        .filter('formatAvatar', [function () {
            return function (avatar) {
                return avatar ? avatar : 'http://www.placehold.it/50x50/EFEFEF/AAAAAA&text=Avatar';
            }
        }])
        .filter('formatNick', [function () {
            return function (nick) {
                return nick ? nick : 'Daisy';
            }
        }])
        .filter('formatImage', [function () {
            return function (image) {
                return (image && image.length > 5) ? image : 'http://www.placehold.it/300x200/EFEFEF/AAAAAA&text=iWomen';
            }
        }]);
});