/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'ngTagsInput'], function (angular) {
    angular.module('iWomen.controllers.look', [
        'bootstrap-tagsinput'
    ])
    .controller('TrendCtrl', function ($scope, $http, $cacheFactory, Look) {
        $scope.view = 'partials/look/list.html';
        $scope.image = {
            url: 'url(http://www.placehold.it/200x200/EFEFEF/AAAAAA&text=image)',
            width: '200px',
            height: '200px'
        };
        $scope.aspects = ['上衣','内裤','帽子'];
        $scope.tags = [];
        $scope.aspect = '...';

        $scope.selectedAspect = function (aspect) {
            $scope.tags.splice(0, 1, aspect);
            $scope.aspect = aspect;
        };

        $scope.changeImage = function (elem) {

            var fd = new FormData();
            angular.forEach(elem.files, function (file) {
                fd.append('file', file);
            });

            $http.post('/api/looks/image', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function (res) {
                if (res.code != 0) {
                    $scope.warning = '图片上传失败，请使用格式及大小正确的图片重试';
                    return;
                }
                $scope.img = res.data.image;
                $scope.hash = res.data.hash;
                $scope.image.url = 'url(' + $scope.img + ')';
                var img = new Image();
                img.onload = function () {
                    $scope.image.width = this.width + 'px';
                    $scope.image.height = this.height + 'px';
                    $scope.$apply();
                };
                img.src = $scope.img;
            })
            .error(function (res) {
                alert('上传失败！（如果你是使用的是Chrome，请关闭 设置=>宽带管理=>减少流量消耗）');
            });
        };

        $scope.uploadSuccess = function (res) {
            console.log(res);
            res = JSON.parse(res);
            if (res.code != 0) {
                $scope.warning = '图片上传失败，请使用格式及大小正确的图片重试';
                return;
            }
            $scope.image = res.data.image;
            $scope.hash = res.data.hash;
        };

        $scope.publish = function () {
            Look.save({
                hash: $scope.hash,
                image: $scope.img,
                description: $scope.description,
                aspect: $scope.aspect,
                tags: $scope.tags
            }, function (res) {
                if (res.code === 0) {

                }
            });
        };

        $scope.looks = [];
        Look.get({type: 'trend', page: 0, num: 10}, function (res) {
            $scope.looks = res.data.looks;
            $cacheFactory.get('looks') ? $cacheFactory.get('looks').destroy() : '';
            var caches = $cacheFactory('looks');
            angular.forEach($scope.looks, function(look, key) {
                caches.put(look._id, look);
            });
        });
        $scope.like = function (lookId) {
            //todo
        };
        $scope.want = function (lookId, favoriteId) {
            //todo
        };
    })
    .controller('LookDetailCtrl', function ($scope, $routeParams, $cacheFactory) {
            $scope.view = 'partials/look/detail.html';
            $scope.look = $cacheFactory.get('looks').get($routeParams.lookId);
            $scope.like = function () {
                //todo
            };

            $scope.want = function (favoriteId) {
                //todo
            };
            $scope.onAddTip = function (favoriteId) {
                $scope.favoriteId = favoriteId;
            };
            $scope.addTip = function () {
                //todo
            };
    });
});